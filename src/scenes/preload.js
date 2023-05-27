class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        // Perso test
        this.load.spritesheet('player', 'assets/player_test.png', { frameWidth: 64, frameHeight: 128});

        this.load.spritesheet('frogImage', 'assets/player_frog.png', { frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('hogImage', 'assets/player_hog.png', { frameWidth: 256, frameHeight: 128});
        this.load.spritesheet('ravenImage', 'assets/player_raven.png', { frameWidth: 128, frameHeight: 128});

        this.load.spritesheet('mob', 'assets/mob_test.png', { frameWidth: 64, frameHeight: 128});

        this.load.image('background', 'assets/background.png');

        // Box
        this.load.image('box', 'assets/caisse.png');     

        this.load.image('movingPlat', 'assets/movingPlat.png');     

        this.load.image('break', 'assets/break.png');

        //this.load.image('feather', 'src/scenes/feather.png');

        this.load.image('ravenPlatOff', 'assets/ravenPlatOff.png');
        this.load.image('ravenPlatOn', 'assets/ravenPlatOn.png');

        this.load.image('hook', 'assets/hook.png');
        this.load.image('rope', 'assets/rope.png');
        this.load.image('stake', 'assets/stake.png');

        this.load.image('cure', 'assets/cure.png');

        // fichier image du tileset
        this.load.image('tilesetTest_image', 'assets/placeholder_test.png'); //Tileset test
        
        this.load.image('tileset_image', 'assets/tileset.png'); //Tileset officiel

        // Maps (JSON)
        this.load.tilemapTiledJSON('map_test', 'maps/test/testScene.json');
        this.load.tilemapTiledJSON('map_01', 'maps/level_01.json');      
    }

    create() {
        this.scene.start("Level_01", {
            // POUR LA TESTROOM :
            //mapName: "map_test", // nom de la map
            //mapTileset: "placeholder_test", // nom du tileset sur TILED
            //mapTilesetImage: "tilesetTest_image", // nom du fichier image du tileset
            
            mapName: "map_01", // nom de la map
            mapTileset: "tileset", // nom du tileset sur TILED
            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
        });
    }

}

export default Preload