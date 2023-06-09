class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {

        // mainScreen

        this.load.image('mainScreen_background', 'assets/mainScreen_Background.png');
        this.load.image('mainScreen_logo', 'assets/mainScreen_Logo.png');
        this.load.image('mainScreen_start', 'assets/mainScreen_Start.png');
        this.load.image('mainScreen_set', 'assets/mainScreen_tree.png');

        //background

        this.load.image('background_sky', 'assets/background_sky.png');
        this.load.image('background_mountain1', 'assets/background_mountain1.png');
        this.load.image('background_mountain2', 'assets/background_mountain2.png');
        this.load.image('background_clouds', 'assets/background_clouds.png');
        this.load.image('background_farForest', 'assets/background_farForest.png');
        this.load.image('background_moon', 'assets/background_moon.png');
        this.load.image('background_foreground1', 'assets/background_foreground1.png');
        this.load.image('background_foreground2', 'assets/background_foreground2.png');
        this.load.image('background_floatingIsles', 'assets/background_floatingIsles.png');
        this.load.image('foreground', 'assets/foreground.png');


        // Perso test
        this.load.spritesheet('player', 'assets/player_test.png', { frameWidth: 64, frameHeight: 128 });

        this.load.spritesheet('frogImage', 'assets/player_frog.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('frogAnim', 'assets/spritesheet_frog.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('frogAnim2', 'assets/spritesheet_frog3.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('hogImage', 'assets/player_hog.png', { frameWidth: 256, frameHeight: 128 });
        this.load.spritesheet('hogAnim1', 'assets/spritesheet_hog1.png', { frameWidth: 256, frameHeight: 192 });
        this.load.spritesheet('hogAnim2', 'assets/spritesheet_hog2.png', { frameWidth: 256, frameHeight: 192 });

        this.load.spritesheet('ravenImage', 'assets/player_raven.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('ravenAnim1', 'assets/spritesheet_raven1.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('ravenAnim2', 'assets/spritesheet_raven2.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('ravenAnim3', 'assets/spritesheet_raven3.png', { frameWidth: 192, frameHeight: 192 });

        this.load.spritesheet('mob', 'assets/mob_test.png', { frameWidth: 64, frameHeight: 128 });

        this.load.image('background', 'assets/background.png');

        this.load.image("particule_test", "assets/particule_test.png");

        this.load.image("particule_cursor", "assets/particule_cursor.png");

        this.load.image('cpFrogImage', 'assets/checkPointFrog.png');
        this.load.image('cpHogImage', 'assets/checkPointHog.png');
        this.load.image('cpRavenImage', 'assets/checkPointRaven.png');

        // Box
        this.load.image('box', 'assets/caisse.png');
        this.load.image('bigBox', 'assets/bigBox.png')

        this.load.image('movingPlat', 'assets/movingPlat.png');

        this.load.spritesheet('break', 'assets/breakingRock.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('ravenPlat', 'assets/ravenPlat.png', { frameWidth: 128, frameHeight: 128 });

        //this.load.image('ravenPlatOn', 'assets/ravenPlatOn.png');
        this.load.image('stake', 'assets/stake.png');

        this.load.image('cure', 'assets/cure.png');

        this.load.spritesheet('pic', 'assets/pics.png', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('weakPlat1', 'assets/falling_tree1.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('weakPlat2', 'assets/falling_tree2.png', { frameWidth: 192, frameHeight: 192 });

        this.load.spritesheet('weakPlatVertical', 'assets/weakPlatVertical.png', { frameWidth: 192, frameHeight: 384 });

        this.load.image('buttonBase', 'assets/buttonBase.png')
        this.load.image('button', 'assets/button.png')
        this.load.image('door', 'assets/door.png')

        this.load.image('feather', 'assets/feather.png');

        this.load.image('hook', 'assets/hook.png');
        this.load.image('rope', 'assets/rope.png');

        // SOUND

        this.load.audio('music_inGame', 'assets/sound/music_inGame.mp3');
        this.load.audio('ambiance_sound', 'assets/sound/ambiance_inGame.mp3');

        this.load.audio('possessFrogSound', 'assets/sound/possess_Frog.mp3');
        this.load.audio('possessHogSound', 'assets/sound/possess_Hog.mp3');
        this.load.audio('possessRavenSound', 'assets/sound/possess_Raven.mp3');

        this.load.audio('deathFrogSound', 'assets/sound/death_Frog.mp3');
        this.load.audio('deathHogSound', 'assets/sound/death_Hog.mp3');
        this.load.audio('deathRavenSound', 'assets/sound/death_Raven.mp3');

        this.load.audio('checkPointSound', 'assets/sound/newCheckPoint.mp3');

        // fichier image du tileset
        this.load.image('tilesetTest_image', 'assets/placeholder_test.png'); //Tileset test

        this.load.image('tileset_image', 'assets/tileset.png'); //Tileset officiel

        // Maps (JSON)
        this.load.tilemapTiledJSON('map_test', 'maps/test/testScene.json');
        this.load.tilemapTiledJSON('map_01', 'maps/level_01.json');
        this.load.tilemapTiledJSON('map_02', 'maps/level_02.json');
        this.load.tilemapTiledJSON('map_03', 'maps/level_03.json');
        this.load.tilemapTiledJSON('map_04', 'maps/level_04.json');
        this.load.tilemapTiledJSON('map_05', 'maps/level_05.json');
        this.load.tilemapTiledJSON('map_06', 'maps/level_06.json');
    }

    create() {
        this.music = this.sound.add('music_inGame');

        this.music.play();
        this.music.setLoop(true)
            .setVolume(0.4);

        this.anims.create({
            key: 'variousPics',
            frames: this.anims.generateFrameNames('pic', {
                start: 0,
                end: 4
            })
        });

        // FALLING TREE
        this.anims.create({
            key: 'fallingTree_idle',
            frames: [{ key: 'weakPlat1', frame: 0 }],
        });

        this.anims.create({
            key: 'fallingTree_destroy',
            frames: this.anims.generateFrameNumbers('weakPlat1', { start: 1, end: 17 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'fallingTree_recreate',
            frames: this.anims.generateFrameNumbers('weakPlat2', { start: 0, end: 31 }),
            frameRate: 25,
            repeat: 0
        });

        // FALLING TREE
        this.anims.create({
            key: 'weakPlatVertical_idle',
            frames: [{ key: 'weakPlatVertical', frame: 0 }],
        });

        this.anims.create({
            key: 'weakPlatVertical_shake',
            frames: this.anims.generateFrameNumbers('weakPlatVertical', { start: 1, end: 18 }),
            frameRate: 50,
            repeat: 0
        });

        this.anims.create({
            key: 'weakPlatVertical_destroy',
            frames: this.anims.generateFrameNumbers('weakPlatVertical', { start: 19, end: 29 }),
            frameRate: 25,
            repeat: 0
        });

        /*this.anims.create({
            key: 'fallingTree_recreate',
            frames: this.anims.generateFrameNumbers('weakPlat2', { start: 0, end: 31 }),
            frameRate: 25,
            repeat: 0
        });*/

        // BREAKING WALL
        this.anims.create({
            key: 'breakingWall_idle',
            frames: [{ key: 'break', frame: 0 }],
        });

        this.anims.create({
            key: 'breakingWall_destroy',
            frames: this.anims.generateFrameNumbers('break', { start: 1, end: 20 }),
            frameRate: 25,
            repeat: 0
        });

        // RAVEN PLAT

        this.anims.create({
            key: 'ravenPlat_off',
            frames: [{ key: 'ravenPlat', frame: 0 }],
        });

        this.anims.create({
            key: 'ravenPlat_on',
            frames: this.anims.generateFrameNumbers('ravenPlat', { start: 1, end: 9 }),
            frameRate: 25,
            repeat: 0
        });

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
            frames: this.anims.generateFrameNumbers('frogAnim', { start: 1, end: 9 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_fall',
            frames: this.anims.generateFrameNumbers('frogAnim', { start: 10, end: 20 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_reception',
            frames: this.anims.generateFrameNumbers('frogAnim', { start: 21, end: 29 }),
            frameRate: 40,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_walk',
            frames: this.anims.generateFrameNumbers('frogAnim', { start: 34, end: 54 }),
            frameRate: 35,
            repeat: -1
        });

        this.anims.create({
            key: 'player_frog_wallGrab',
            frames: [{ key: 'frogAnim', frame: 59 }],
        });

        this.anims.create({
            key: 'player_frog_slideWall',
            frames: this.anims.generateFrameNumbers('frogAnim', { start: 60, end: 64 }),
            frameRate: 10,
            repeat: 0
        });

        // HOOK

        this.anims.create({
            key: 'player_frog_hookStartGround',//
            frames: this.anims.generateFrameNumbers('frogAnim2', { start: 0, end: 4 }),
            frameRate: 40,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_hookBackGround', //
            frames: this.anims.generateFrameNumbers('frogAnim2', { start: 5, end: 9 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_hookStartJump',//
            frames: this.anims.generateFrameNumbers('frogAnim2', { start: 14, end: 19 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_hookBackJump',//
            frames: this.anims.generateFrameNumbers('frogAnim2', { start: 19, end: 14 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_frog_hookAttrackGround',
            frames: this.anims.generateFrameNumbers('frogAnim2', { start: 24, end: 33 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({//
            key: 'player_frog_hookAttrackJump', //
            frames: [{ key: 'frogAnim', frame: 33 }],

        });

        this.anims.create({
            key: 'player_frog_hookFall', //
            frames: this.anims.generateFrameNumbers('frogAnim2', { start: 34, end: 44 }),
            frameRate: 25,
            repeat: 0
        });

        // HOG

        this.anims.create({
            key: 'player_hog_left',
            frames: [{ key: 'hogAnim1', frame: 0 }],
        });

        this.anims.create({
            key: 'player_hog_right',
            frames: [{ key: 'hogAnim1', frame: 0 }],
        });

        this.anims.create({
            key: 'player_hog_jump',
            frames: this.anims.generateFrameNumbers('hogAnim1', { start: 1, end: 19 }),
            frameRate: 130,
            repeat: 0
        });

        this.anims.create({
            key: 'player_hog_fall',
            frames: this.anims.generateFrameNumbers('hogAnim1', { start: 20, end: 29 }),
            frameRate: 35,
            repeat: 0
        });

        this.anims.create({
            key: 'player_hog_reception',
            frames: this.anims.generateFrameNumbers('hogAnim1', { start: 30, end: 39 }),
            frameRate: 75,
            repeat: 0
        });

        this.anims.create({
            key: 'player_hog_hit',
            frames: this.anims.generateFrameNumbers('hogAnim1', { start: 40, end: 58 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_hog_walk',
            frames: this.anims.generateFrameNumbers('hogAnim2', { start: 0, end: 32 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_hog_charge',
            frames: this.anims.generateFrameNumbers('hogAnim2', { start: 36, end: 51 }),
            frameRate: 35,
            repeat: -1
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
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 1, end: 19 }),
            frameRate: 60,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_jumpToPlane',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 20, end: 24 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_planeToFall',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 25, end: 29 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_fallToPlane',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 29, end: 25 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_fallToReception',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 30, end: 39 }),
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_jumpToFall',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 40, end: 45 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_planeToReception',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 46, end: 54 }),
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_doubleJump',
            frames: this.anims.generateFrameNumbers('ravenAnim1', { start: 59, end: 74 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_fallToJump',
            frames: this.anims.generateFrameNumbers('ravenAnim2', { start: 0, end: 19 }),
            frameRate: 40,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_planeToJump',
            frames: this.anims.generateFrameNumbers('ravenAnim2', { start: 20, end: 41 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_groundtoFall',
            frames: this.anims.generateFrameNumbers('ravenAnim2', { start: 43, end: 48 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_walk',
            frames: this.anims.generateFrameNumbers('ravenAnim2', { start: 49, end: 79 }),
            frameRate: 35,
            repeat: -1
        });

        this.anims.create({
            key: 'player_raven_prepareShootOnGround',
            frames: this.anims.generateFrameNumbers('ravenAnim3', { start: 0, end: 8 }),
            frameRate: 35
        });

        this.anims.create({
            key: 'player_raven_prepareShootOnJump',
            frames: this.anims.generateFrameNumbers('ravenAnim3', { start: 34, end: 39 }),
            frameRate: 35,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_prepareShootOnPlane',
            frames: this.anims.generateFrameNumbers('ravenAnim3', { start: 40, end: 45 }),
            frameRate: 35,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_shootOnAir',
            frames: this.anims.generateFrameNumbers('ravenAnim3', { start: 9, end: 26 }),
            frameRate: 35,
            repeat: 0
        });

        this.anims.create({
            key: 'player_raven_shootOnGround',
            frames: this.anims.generateFrameNumbers('ravenAnim3', { start: 9, end: 33 }),
            frameRate: 45,
            repeat: 0
        });

        // START SCENE (> Changer le paramètre dans la parenthèse après start, et la map name)  

        this.scene.start("MainScreen");

        // START SCENE (> Changer le paramètre dans la parenthèse après start, et la map name)  

        /*this.scene.start("Level_03", {
            // POUR LA TESTROOM :

            //mapName: "map_test", // nom de la map
            //mapTileset: "placeholder_test", // nom du tileset sur TILED
            //mapTilesetImage: "tilesetTest_image", // nom du fichier image du tileset

            // POUR LE JEU :

            mapName: "map_03", // nom de la map
            mapTileset: "tileset", // nom du tileset sur TILED
            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
        });*/
    }

}

export default Preload