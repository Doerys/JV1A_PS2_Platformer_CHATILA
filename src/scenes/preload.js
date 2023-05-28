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
        this.load.image('bigBox', 'assets/bigBox.png')

        this.load.image('movingPlat', 'assets/movingPlat.png');     

        this.load.image('break', 'assets/break.png');

        //this.load.image('feather', 'src/scenes/feather.png');

        this.load.image('ravenPlatOff', 'assets/ravenPlatOff.png');
        this.load.image('ravenPlatOn', 'assets/ravenPlatOn.png');

        this.load.image('hook', 'assets/hook.png');
        this.load.image('rope', 'assets/rope.png');
        this.load.image('stake', 'assets/stake.png');

        this.load.image('cure', 'assets/cure.png');

        this.load.image('pic', 'assets/pics.png')

        this.load.image('weakPlat', 'assets/weakPlat_3x1.png')

        this.load.image('bigWeakPlat', 'assets/weakPlat_5x1.png')

        // fichier image du tileset
        this.load.image('tilesetTest_image', 'assets/placeholder_test.png'); //Tileset test
        
        this.load.image('tileset_image', 'assets/tileset.png'); //Tileset officiel

        // Maps (JSON)
        this.load.tilemapTiledJSON('map_test', 'maps/test/testScene.json');
        this.load.tilemapTiledJSON('map_01', 'maps/level_01.json');
        this.load.tilemapTiledJSON('map_02', 'maps/level_02.json');            
    }

    create() {

        // animation joueur
        this.anims.create({
            key: 'player_frog_left',
            frames: [{ key: 'frogImage', frame: 0 }],
        });

        this.anims.create({
            key: 'player_frog_right',
            frames: [{ key: 'frogImage', frame: 1 }],
        });

        this.scene.start("TestScene", {
            // POUR LA TESTROOM :
            mapName: "map_test", // nom de la map
            mapTileset: "placeholder_test", // nom du tileset sur TILED
            mapTilesetImage: "tilesetTest_image", // nom du fichier image du tileset
            
            /*mapName: "map_02", // nom de la map
            mapTileset: "tileset", // nom du tileset sur TILED
            mapTilesetImage: "tileset_image", // nom du fichier image du tileset*/
        });
    }

}

export default Preload