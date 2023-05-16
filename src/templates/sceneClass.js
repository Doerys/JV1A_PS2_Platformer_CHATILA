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

    create() {
        
        
    }

    update() { }

    loadMap(levelMap) {;

        // on prend le tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // on crée le calque plateformes
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset);
        const layer_spawn = levelMap.getObjectLayer("Spawn");

        // ajout de collision sur plateformes
        layer_platforms.setCollisionByProperty({ estSolide : true });

        // On enregistre le spawn dans une variable
        const spawnPoint = layer_spawn.objects[0];
        this.spawn = layer_spawn.objects[0];

        return {spawnPoint, layer_platforms, tileset }
    }

    createPlayer(x, y, layers) {

        this.player = new Player(this, x + 32, y, 'player').setCollideWorldBounds();

        //COLLISIONS

        this.physics.add.collider(this.player, layers.layer_platforms); // player > plateformes
        //this.physics.add.collider(this.player, this.box, this.handleBoxCollision(), null, this);
        //this.physics.add.collider(this.box, layers); // box > plateformes
        
    }

}
export default SceneClass;