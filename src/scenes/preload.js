class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        // Perso test
        this.load.spritesheet('player', 'src/scenes/player_test.png', { frameWidth: 64, frameHeight: 128});

        // Box
        this.load.image('box', 'src/scenes/caisse.png'); //Tileset    


        this.load.image('tileset_image', 'src/scenes/placeholder_test.png'); //Tileset     

        // Maps (JSON)
        this.load.tilemapTiledJSON('map_test', 'src/scenes/testScene.json');
    }

    create() {
        console.log("PRELOAD ATTEINT");
        /*this.scene.start("TestScene", {
            mapName: "map_test", // nom de la map
            mapTileset: "plaholder_test", // nom du tileset sur TILED
            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
        });*/
    }

}

export default Preload