class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {
        // Perso test
        this.load.spritesheet('player', 'assets/player_test.png', { frameWidth: 64, frameHeight: 128});

        this.load.spritesheet('frogImage', 'assets/player_frog.png', { frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('frogAnim', 'assets/spritesheet_frog.png', { frameWidth: 128, frameHeight: 128});

        this.load.spritesheet('hogImage', 'assets/player_hog.png', { frameWidth: 256, frameHeight: 128});

        this.load.spritesheet('ravenImage', 'assets/player_raven.png', { frameWidth: 128, frameHeight: 128});
        this.load.spritesheet('ravenAnim1', 'assets/spritesheet_raven1.png', { frameWidth: 192, frameHeight: 192});
        this.load.spritesheet('ravenAnim2', 'assets/spritesheet_raven2.png', { frameWidth: 192, frameHeight: 192});

        this.load.spritesheet('mob', 'assets/mob_test.png', { frameWidth: 64, frameHeight: 128});

        this.load.image('background', 'assets/background.png');

        this.load.image("particule_test", "assets/particule_test.png");

        this.load.image("particule_cursor", "assets/particule_cursor.png");

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

        this.load.image('weakPlatVertical', 'assets/weakPlatVertical.png')

        this.load.image('buttonBase', 'assets/buttonBase.png')
        this.load.image('button', 'assets/button.png')
        this.load.image('door', 'assets/door.png')

        // fichier image du tileset
        this.load.image('tilesetTest_image', 'assets/placeholder_test.png'); //Tileset test
        
        this.load.image('tileset_image', 'assets/tileset.png'); //Tileset officiel

        // Maps (JSON)
        this.load.tilemapTiledJSON('map_test', 'maps/test/testScene.json');
        this.load.tilemapTiledJSON('map_01', 'maps/level_01.json');
        this.load.tilemapTiledJSON('map_02', 'maps/level_02.json');            
    }

    create() {

        // ANIMATIONS FROG

        // PLAYER
        this.anims.create({
            key: 'player_frog_left',
            frames: [{ key: 'frogAnim', frame: 0 }],
        });

        this.anims.create({
            key: 'player_frog_right',
            frames: [{ key: 'frogAnim', frame: 0 }],
        });

        this.anims.create({
            key: 'player_frog_jump',
            frames: this.anims.generateFrameNumbers('frogAnim', {start:1,end:9}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_frog_fall',
            frames: this.anims.generateFrameNumbers('frogAnim', {start:10,end:20}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_frog_reception',
            frames: this.anims.generateFrameNumbers('frogAnim', {start:21,end:29}),
            frameRate: 40,
            repeat : 0
        });
        
        this.anims.create({
            key: 'player_frog_walk',
            frames: this.anims.generateFrameNumbers('frogAnim', {start:34,end:54}),
            frameRate: 35,
            repeat : -1
        });

        this.anims.create({
            key: 'player_frog_wallGrab',
            frames: [{ key: 'frogAnim', frame: 59 }],
        });

        this.anims.create({
            key: 'player_frog_slideWall',
            frames: this.anims.generateFrameNumbers('frogAnim', {start:60,end:64}),
            frameRate: 10,
            repeat : 0
        });

        // RAVEN 

        this.anims.create({
            key: 'player_raven_left',
            frames: [{ key: 'ravenAnim1', frame: 0 }],
        });

        this.anims.create({
            key: 'player_raven_right',
            frames: [{ key: 'ravenAnim1', frame: 0 }],
        });

        this.anims.create({
            key: 'player_raven_groundToJump',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:1,end:19}),
            frameRate: 60,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_jumpToPlane',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:20,end:24}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_planeToFall',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:25,end:29}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_fallToPlane',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:29,end:25}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_fallToReception',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:30,end:39}),
            frameRate: 30,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_jumpToFall',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:40,end:45}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_planeToReception',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:46,end:54}),
            frameRate: 30,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_doubleJump',
            frames: this.anims.generateFrameNumbers('ravenAnim1', {start:59,end:74}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_fallToJump',
            frames: this.anims.generateFrameNumbers('ravenAnim2', {start:0,end:19}),
            frameRate: 40,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_planeToJump',
            frames: this.anims.generateFrameNumbers('ravenAnim2', {start:20,end:41}),
            frameRate: 25,
            repeat : 0
        });

        this.anims.create({
            key: 'player_raven_groundtoFall',
            frames: this.anims.generateFrameNumbers('ravenAnim2', {start:43,end:48}),
            frameRate: 25,
            repeat : 0
        });
        
        this.anims.create({
            key: 'player_raven_walk',
            frames: this.anims.generateFrameNumbers('ravenAnim2', {start:49,end:79}),
            frameRate: 35,
            repeat : -1
        });


        // START SCENE (> Changer le paramètre dans la parenthèse après start, et la map name)  
        
        this.scene.start("TestScene", {
            // POUR LA TESTROOM :
            
            mapName: "map_test", // nom de la map
            mapTileset: "placeholder_test", // nom du tileset sur TILED
            mapTilesetImage: "tilesetTest_image", // nom du fichier image du tileset
            
            // POUR LE JEU :

            //mapName: "map_01", // nom de la map
            //mapTileset: "tileset", // nom du tileset sur TILED
            //mapTilesetImage: "tileset_image", // nom du fichier image du tileset
        });
    }

}

export default Preload