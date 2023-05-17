import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";

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

        // chargement des calques
        const layers = this.loadMap(levelMap);

        // création du player
        this.createPlayer(layers.spawnPoint.x,layers.spawnPoint.y,layers);
        
        /*this.mob = this.add.sprite(this.spawn.x +32, this.spawn.y, 'mob')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', function (){
        
            this.possessMob(this.mob, this.mob.x, this.mob.y, layers);

        }, this)*/

        // création d'une box
        this.box = this.physics.add.sprite(400, 1472, 'box').setImmovable(true);

        // implémentation pour contrôle à la manette
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