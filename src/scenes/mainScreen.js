class MainScreen extends Phaser.Scene {
    constructor() {
        super("MainScreen");
    }

    preload() {

    }

    create() {

        this.cameras.main
        .setBounds(0, 0, 3072, 1728) //format 16/9
        .setSize(3072, 1728)
        .setOrigin(0, 0)
        .fadeIn(1500, 0, 0, 25) // fondu au noir

        this.add.image(0, 0, 'mainScreen_background').setOrigin(0, 0).setDepth(0);
        this.add.image(0, 0, 'mainScreen_logo').setOrigin(0, 0).setDepth(1);
        this.add.image(0, 0, 'mainScreen_set').setOrigin(0, 0).setDepth(3);
        this.startButton = this.add.image(1013, 1182, 'mainScreen_start')
        .setTint(0xffffff)
        .setOrigin(0, 0)
        .setInteractive({ cursor: 'pointer' });

        this.startButton.on("pointerdown", this.launchGame, this)

        //this.lights.enable()

        /*this.lightMouse = this.lights.addLight(0, 0, 95, 0x00aaff, 10).setVisible(true);

        const emitter = this.add.particles("particule_cursor").setDepth(-1).createEmitter({
            follow: this.lightMouse,
            lifespan: 50,
            alpha: 0.25,
            frequency: 50,
            quantity: 1,
            blendMode: 'COLOR_BURN',
        });

        this.input.on('pointermove', (pointer) => {
            this.lightMouse.x = pointer.x;
            this.lightMouse.y = pointer.y;

            emitter.emitParticle();
        }, this);*/

    }

    update() {

        this.startButton.on('pointerover', () => { this.startButton.setTint(0x00008b)}, this); 
 
        this.startButton.on('pointerout', () => { this.startButton.setTint(0xffffff)}, this);

    }

    /*changeOver(){
        this.gameButton.setFrame(0);
    }

    changeOut(){
        this.gameButton.setFrame(1);
    }*/

    launchGame() {

        this.cameras.main
        .fadeOut(1500, 0, 0, 25) // fondu au noir

        // START SCENE (> Changer le paramètre dans la parenthèse après start, et la map name)  

        this.scene.start("Level_01", {
            // POUR LA TESTROOM :

            //mapName: "map_test", // nom de la map
            //mapTileset: "placeholder_test", // nom du tileset sur TILED
            //mapTilesetImage: "tilesetTest_image", // nom du fichier image du tileset

            // POUR LE JEU :

            mapName: "map_01", // nom de la map
            mapTileset: "tileset", // nom du tileset sur TILED
            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
        });
    }
}

export default MainScreen