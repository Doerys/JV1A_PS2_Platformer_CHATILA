import SceneClass from "../templates/sceneClass.js";

class TestScene extends SceneClass {

    constructor() {
        super('TestScene');
    }

    init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
      };

    create(){

        this.spawnX = 96;
        this.spawnY = 1472;

        this.controller = false;
        
        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // load des layers
        this.layer_platforms = this.map_Test.createLayer('layer_platforms', this.tileset_Test);
        this.layer_platforms.setCollisionByProperty({ estSolide: true });

        this.box = this.physics.add.sprite(400, 1472, 'box').setImmovable(true);

        // load personnage

        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        // PLAYER - Collision entre le joueur et les limites du niveau

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728).setSize(3072, 1728); //format 16/9 
    }

    update () {

    }
}

export default TestScene