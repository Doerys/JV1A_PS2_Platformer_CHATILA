import Player from "src/entities/player.js";

class SceneClass extends Phaser.Scene {

    constructor(name) {
        super({
            key: name,
            physics: {
                arcade: {
                    debug: false,
                    gravity: { y: 800 }
                }
            },
            render: {
                pipeline: 'Light2D'
            }
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

    loadMap(levelMap, nextLevel) {;

        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        const layer_platformes = levelMap.createLayer("layer_platformes", tileset);

        layer_platformes.setCollisionByProperty({ estSolide : true });

        this.physics.add.collider(this.player, this.layer_platforms);
        this.physics.add.collider(this.player, this.box, this.handleBoxCollision(), null, this);
        this.physics.add.collider(this.box, this.layer_platforms);

        return {layer_platformes, tileset }
    }

    createPlayer(x,y,layers) {

        this.player = new Player(this.spawnX, this.spawnY, 'player').setCollideWorldBounds();

        this.physics.add.collider(this.player, layers.calc_plateformes);
        this.physics.add.collider(this.player, layers.calc_kill,this.restart,null,this);
        
    }

}
export default SceneClass;