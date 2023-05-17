import Player from "../entities/player.js";

class SceneClass extends Phaser.Scene {

    constructor(name) { // name = on reprend le nom qu'on trouve dans le constructeur du niveau
        super({
            key: name,
            physics: {
                default: 'arcade',
                arcade: {
                    //gravity: { y: 1450 },
                    gravity: { y : 1600 },
                    debug: true,
                    tileBias: 64,
                }
            },
            
            input:{gamepad:true},
            
            fps: {
                target: 60,
            },
        })
    }

    Init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
    }

    loadMap(levelMap) {

        // on prend le tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // on crée le calque plateformes
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset);
        const layer_spawn = levelMap.getObjectLayer("Spawn");
        const layer_break = levelMap.getObjectLayer("Break");

        // ajout de collision sur plateformes
        layer_platforms.setCollisionByProperty({ estSolide : true });

        // On enregistre le spawn dans une variable
        const spawnPoint = layer_spawn.objects[0];
        this.spawn = layer_spawn.objects[0];

        return {spawnPoint, layer_platforms, layer_break, tileset }
    }

    createPlayer(x, y, layers) {
        this.player = new Player(this, x, y, 'player').setCollideWorldBounds();

        //COLLISIONS

        this.physics.add.collider(this.player, layers.layer_platforms); // player > plateformes
        //this.physics.add.collider(this.player, this.box, this.handleBoxCollision(), null, this);
        //this.physics.add.collider(this.box, layers); // box > plateformes

        this.breaks = this.physics.add.staticGroup();

        layers.layer_break.objects.forEach(break_create => {
            const breaks = this.breaks.create(break_create.x + 32, break_create.y + 32, "break");
            this.physics.add.collider(this.player, breaks, function() { breaks.destroy(); this.player.stopCharge()}, null, this);
        }, this)
    }

    possessMob(mob, mobX, mobY, layers){
        mob.destroy();
        this.createPlayer(mobX, mobY, layers);
    }
}
export default SceneClass;