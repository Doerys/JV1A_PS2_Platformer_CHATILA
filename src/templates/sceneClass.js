import Player from "../entities/player.js";

class SceneClass extends Phaser.Scene {

    constructor(name) { // name = on reprend le nom qu'on trouve dans le constructeur du niveau
        super({
            key: name,
            physics: {
                default: 'arcade',
                arcade: {
                    //gravity: { y: 1450 },
                    gravity: { y: 1600 },
                    debug: true,
                    tileBias: 64,
                }
            },

            input: { gamepad: true },

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

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        // PLAYER - Collision entre le joueur et les limites du niveau

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728).setSize(3072, 1728); //format 16/9 

        // on prend le tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // on crée le calque plateformes
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset);
        const layer_spawn = levelMap.getObjectLayer("Spawn");
        const layer_break = levelMap.getObjectLayer("Break");
        const layer_box = levelMap.getObjectLayer("Box");

        // ajout de collision sur plateformes
        layer_platforms.setCollisionByProperty({ estSolide: true });

        // On enregistre le spawn dans une variable
        const spawnPoint = layer_spawn.objects[0];
        this.spawn = layer_spawn.objects[0];

        return { spawnPoint, layer_platforms, layer_break, layer_box, tileset }
    }

    createPlayer(x, y, layers) {
        this.player = new Player(this, x, y, 'player').setCollideWorldBounds();

        //COLLISIONS

        this.physics.add.collider(this.player, layers.layer_platforms); // player > plateformes
        //this.physics.add.collider(this.player, this.box, this.handleBoxCollision(), null, this);
    }

    possessMob(mob, mobX, mobY, layers) {
        mob.destroy();
        this.createPlayer(mobX, mobY, layers);
    }
}
export default SceneClass;