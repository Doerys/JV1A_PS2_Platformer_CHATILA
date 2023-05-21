class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        // Perso test
        this.load.spritesheet('player', 'src/scenes/player_test.png', { frameWidth: 64, frameHeight: 128});

        this.load.spritesheet('frogImage', 'src/scenes/player_frog.png', { frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('hogImage', 'src/scenes/player_hog.png', { frameWidth: 128, frameHeight: 128});
        this.load.spritesheet('ravenImage', 'src/scenes/player_raven.png', { frameWidth: 64, frameHeight: 96});

        this.load.spritesheet('mob', 'src/scenes/mob_test.png', { frameWidth: 64, frameHeight: 128});

        // Box
        this.load.image('box', 'src/scenes/caisse.png');     

        this.load.image('movingPlat', 'src/scenes/movingPlat.png');     

        this.load.image('break', 'src/scenes/break.png');

        //this.load.image('feather', 'src/scenes/feather.png');

        this.load.image('ravenPlatOff', 'src/scenes/ravenPlatOff.png');
        this.load.image('ravenPlatOn', 'src/scenes/ravenPlatOn.png');

        // fichier image du tileset
        this.load.image('tileset_image', 'src/scenes/placeholder_test.png'); //Tileset     

        // Maps (JSON)
        this.load.tilemapTiledJSON('map_test', 'src/scenes/testScene.json');
    }

    create() {
        this.scene.start("TestScene", {
            mapName: "map_test", // nom de la map
            mapTileset: "placeholder_test", // nom du tileset sur TILED
            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
        });
    }

}

export default Preload