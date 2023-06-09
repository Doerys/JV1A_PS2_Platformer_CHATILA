import Player from "../entities/player.js";
import PlayerFrog from "../entities/playerFrog.js";
import PlayerHog from "../entities/playerHog.js";
import PlayerRaven from "../entities/playerRaven.js";

import Mob from "../entities/mob.js";
import MobFrog from "../entities/mobFrog.js";
import MobHog from "../entities/mobHog.js";
import MobRaven from "../entities/mobRaven.js";

import Projectile from "../entities/projectile.js";

class SceneClass extends Phaser.Scene {

    constructor(name) { // name = on reprend le nom qu'on trouve dans le constructeur du niveau
        super({
            key: name,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1600 },
                    debug: false,
                    tileBias: 64, // permet d'éviter de passer à travers les tiles à la réception d'un saut
                }
            },

            input: { gamepad: true },

            fps: {
                target: 60,
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

    // load des CALQUES / OBJETS / SPAWNS MOBS dans une constante liée à chaque niveau 
    loadMap(levelMap) {

        this.physics.world.setBounds(0, 0, 3072, 1920); // légèrement plus haut (pour dead zone hors caméra)
        this.physics.world.setBoundsCollision(true, true, false, false)

        // CAMERA
        this.cameras.main
            .setBounds(0, 0, 3072, 1728) //format 16/9
            .setSize(3072, 1728)
            .setOrigin(0, 0)
            .fadeIn(1500, 0, 0, 25) // fondu au noir

        //Enlever commentaire pour voir la deadZone
        //this.cameras.main.setBounds(0, 192, 3072, 1920).setSize(3072, 1920).setOrigin(0, 0); 

        // ARRIERE PLAN - BACKGROUND
        this.backgroundSky = this.add.tileSprite(0, 0, 3072, 1728, "background_sky")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-15); // profondeur

        this.backgroundMoon = this.add.tileSprite(0, 0, 3072, 1728, "background_moon")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-14); // profondeur

        this.backgroundMountain1 = this.add.tileSprite(0, 0, 3072, 1728, "background_mountain1")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-13); // profondeur

        this.backgroundClouds = this.physics.add.sprite(0, 0, "background_clouds")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-12) // profondeur
            .setVelocityX(15);

        this.backgroundClouds.body.setAllowGravity(false)

        this.backgroundMountain2 = this.add.tileSprite(0, 0, 3072, 1728, "background_mountain2")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-11); // profondeur

        this.backgroundFarForest = this.add.tileSprite(0, 0, 3072, 1728, "background_farForest")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-10); // profondeur

        this.backgroundForeground1 = this.add.tileSprite(0, 0, 3072, 1728, "background_foreground1")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-9); // profondeur

        this.backgroundForeground2 = this.add.tileSprite(0, 0, 3072, 1728, "background_foreground2")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-8); // profondeur

        this.backgroundFlyingIsles = this.physics.add.sprite(0, 0, "background_floatingIsles")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-9) // profondeur
            .setVelocityX(5);

        this.backgroundFlyingIsles.body.setAllowGravity(false)

        this.foreground = this.add.tileSprite(0, 0, 3072, 1728, "foreground")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(10) // profondeur

        // Tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // Calques layers
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset).setDepth(1).setPipeline('Light2D');
        const layer_decos1 = levelMap.createLayer("layer_decos1", tileset).setDepth(2).setPipeline('Light2D');
        const layer_decos2 = levelMap.createLayer("layer_decos2", tileset).setDepth(3).setPipeline('Light2D');
        const layer_boxStop = levelMap.createLayer("layer_boxStop", tileset).setDepth(0)
        const layer_limits = levelMap.createLayer("layer_limits", tileset).setVisible(false);
        const layer_deadZone = levelMap.createLayer("layer_deadZone", tileset);

        // Calques objets
        const layer_spawnFrog = levelMap.getObjectLayer("SpawnFrog");
        const layer_spawnHog = levelMap.getObjectLayer("SpawnHog");
        const layer_spawnRaven = levelMap.getObjectLayer("SpawnRaven");

        const layer_checkPFrog = levelMap.getObjectLayer("checkPointFrog");
        const layer_checkPHog = levelMap.getObjectLayer("checkPointHog");
        const layer_checkPRaven = levelMap.getObjectLayer("checkPointRaven");

        const layer_box = levelMap.getObjectLayer("Box");
        const layer_bigBox = levelMap.getObjectLayer("BigBox");
        const layer_stake = levelMap.getObjectLayer("Stake");

        const layer_break = levelMap.getObjectLayer("Break");
        const layer_pics = levelMap.getObjectLayer("Pics");

        const layer_buttonBase = levelMap.getObjectLayer("ButtonBase");
        const layer_button = levelMap.getObjectLayer("Button");
        const layer_door = levelMap.getObjectLayer("Door");

        const layer_cure = levelMap.getObjectLayer("Cure");

        const layer_ravenPlat = levelMap.getObjectLayer("RavenPlatform");
        const layer_weakPlat = levelMap.getObjectLayer("WeakPlat");
        const layer_weakPlatVertical = levelMap.getObjectLayer("WeakPlatVertical");

        const layer_movingPlats = levelMap.getObjectLayer("MovingPlats");

        const layer_nextLevel = levelMap.getObjectLayer("NextLevel");

        // ajout de collision sur plateformes
        layer_platforms.setCollisionByProperty({ estSolide: true });
        layer_boxStop.setCollisionByProperty({ estSolide: true });
        layer_limits.setCollisionByProperty({ estSolide: true });
        layer_deadZone.setCollisionByProperty({ estSolide: true });

        // SPAWNS - Mobs
        const spawnFrog = layer_spawnFrog.objects[0];
        const spawnHog = layer_spawnHog.objects[0];
        const spawnRaven = layer_spawnRaven.objects[0];

        // SPAWNS - Game objects
        const spawnCure = layer_cure.objects[0];
        const spawnDoor = layer_door.objects[0];
        const spawnButton = layer_button.objects[0];
        const spawnButtonBase = layer_buttonBase.objects[0];

        const spawnCheckPFrog = layer_checkPFrog.objects[0];
        const spawnCheckPHog = layer_checkPHog.objects[0];
        const spawnCheckPRaven = layer_checkPRaven.objects[0];

        // NEXT LEVEL

        const nextLevel = this.physics.add.staticGroup();

        // ELEMENTS DE DECORS

        // Boxes

        const boxes = this.physics.add.group({
            //immovable: true,
            //damping: true
        });

        const bigBoxes = this.physics.add.group({
            //immovable: true,
            //damping: true
        });

        // Autres

        const stakes = this.physics.add.group();

        const breaks = this.physics.add.group();
        const pics = this.physics.add.staticGroup();

        // Plateformes spéciales

        const weakPlats = this.physics.add.group();
        const weakPlatsVertical = this.physics.add.group();

        const ravenPlats = this.physics.add.staticGroup();

        /*
        // GROUP MIS DE COTE POUR L'INSTANT (non fonctionnel)
        const movingPlats = this.physics.add.group({
            immovable: true,
            allowGravity: false,
            velocityX : 100
        });
        
        */

        // CREATION DES ELEMENTS DE DECORS

        // Systèmes boutons

        const buttons = this.physics.add.sprite(spawnButton.x + 64, spawnButton.y - 24, "button").setImmovable(true).setPipeline('Light2D');
        buttons.body.setAllowGravity(false);

        const buttonBases = this.physics.add.staticSprite(spawnButtonBase.x + 64, spawnButtonBase.y - 8, "buttonBase").setPipeline('Light2D');

        const checkpointFrog = this.physics.add.staticSprite(spawnCheckPFrog.x + 56, spawnCheckPFrog.y + 64, "cpFrogImage").setSize(64, 64).setOffset(8, 0).setAlpha(0.3).setPipeline('Light2D');
        const checkpointHog = this.physics.add.staticSprite(spawnCheckPHog.x + 64, spawnCheckPHog.y + 64, "cpHogImage").setSize(64, 64).setOffset(0, 0).setAlpha(0.3).setPipeline('Light2D');
        const checkpointRaven = this.physics.add.staticSprite(spawnCheckPRaven.x + 64, spawnCheckPRaven.y + 64, "cpRavenImage").setSize(64, 64).setOffset(0, 0).setAlpha(0.3).setPipeline('Light2D');

        // Boxes normales        
        layer_box.objects.forEach(box => {
            const box_create = this.physics.add.sprite(box.x + 32, box.y, "box").setDamping(true).setImmovable(true).setPipeline('Light2D').setSize(50, 49).setOffset(5, 0);

            this.physics.add.collider(box_create, this.movingPlat1);
            this.physics.add.collider(box_create, this.movingPlat2);
            this.physics.add.collider(box_create, this.movingPlat3);
            this.physics.add.collider(box_create, this.movingPlat4);
            this.physics.add.collider(box_create, this.movingPlat5);

            this.physics.add.collider(box_create, buttonBases, this.boxClimbButtonBase, null, this);
            this.physics.add.collider(box_create, buttons, this.pressButtonsBox, null, this);
            this.physics.add.collider(box_create, this.door);

            boxes.add(box_create);

            box_create.setCollideWorldBounds(true);

            this.physics.add.collider(boxes, layer_platforms, this.boxOnFloor, null, this);
            this.physics.add.collider(boxes, layer_boxStop);

        }, this)

        // Grosses boxes
        layer_bigBox.objects.forEach(bigBox => {

            const box_create = this.physics.add.sprite(bigBox.x + 64, bigBox.y, "bigBox").setDamping(true).setImmovable(true).setPipeline('Light2D').setSize(124, 121).setOffset(0, 0);

            this.physics.add.collider(box_create, this.movingPlat1);
            this.physics.add.collider(box_create, this.movingPlat2);
            this.physics.add.collider(box_create, this.movingPlat3);
            this.physics.add.collider(box_create, this.movingPlat4);
            this.physics.add.collider(box_create, this.movingPlat5);
            this.physics.add.collider(box_create, buttonBases, this.boxClimbButtonBase, null, this);
            this.physics.add.collider(box_create, buttons, this.pressButtonsBox, null, this);
            this.physics.add.collider(box_create, this.door);

            bigBoxes.add(box_create);

            box_create.setCollideWorldBounds(true);
            box_create.flipX = true;

            this.physics.add.collider(bigBoxes, layer_platforms, this.boxOnFloor, null, this);
            this.physics.add.collider(bigBoxes, layer_boxStop);
        }, this)

        // création des poteaux sur lesquels on peut se grappiner
        layer_stake.objects.forEach(stake => {
            const stake_create = this.physics.add.sprite(stake.x + 32, stake.y, "stake").setSize(32, 128).setPipeline('Light2D');

            this.physics.add.collider(stake_create, this.movingPlat1);
            this.physics.add.collider(stake_create, this.movingPlat2);
            this.physics.add.collider(stake_create, this.movingPlat3);
            this.physics.add.collider(stake_create, this.movingPlat4);
            this.physics.add.collider(stake_create, this.movingPlat5);

            stakes.add(stake_create);

            stake_create.setCollideWorldBounds(true);

            this.physics.add.collider(stakes, layer_platforms);
        }, this)

        // création des éléments destructibles (charge)
        layer_break.objects.forEach(break_create => {
            //breaks.create(break_create.x + 64, break_create.y + 128, "break").setSize(128, 256).setPipeline('Light2D');

            const newBreak = this.physics.add.sprite(break_create.x + 64, break_create.y + 128).setImmovable(true).setPushable(false).setTexture("break", 0).setSize(128, 256).setOffset(64, 0).setPipeline('Light2D');
            breaks.add(newBreak);
            newBreak.body.setAllowGravity(false);

        }, this)

        // pics mortels
        layer_pics.objects.forEach(pic => {

            const imagePic = Math.floor(Math.random() * 5);

            const flip = Math.floor(Math.random() * 2);

            pics.create(pic.x + 32, pic.y - 32).setSize(48, 64).setTexture("pic", imagePic);

            if (flip == 0) {
                pics.flipX = true;
            }
            else {
                pics.flipX = false;
            }
        })

        // création des plateformes qu'on peut créer en tirant dessus avec le raven
        layer_ravenPlat.objects.forEach(ravenPlat => {
            //ravenPlats.create(ravenPlat.x + 54, ravenPlat.y + 54, "ravenPlat").setSize(64, 64).setOffset(10, 8).setPipeline('Light2D');

            const newRavenPlat = this.physics.add.staticSprite(ravenPlat.x + 64, ravenPlat.y + 32).setTexture("ravenPlat", 0).setSize(64, 64).setOffset(-16, -16).setPipeline('Light2D');
            ravenPlats.add(newRavenPlat);

        }, this)

        // plateformes destructibles si Hog dessus
        layer_weakPlat.objects.forEach(plat => {

            const newWeakPlat = this.physics.add.sprite(plat.x + 96, plat.y + 64).setImmovable(true).setPushable(false).setTexture("weakPlat1", 0).setSize(192, 32).setOffset(0, 32).setPipeline('Light2D');
            weakPlats.add(newWeakPlat);
            newWeakPlat.body.setAllowGravity(false);
        })

        // plateformes destructibles si Frog wall jump dessus
        layer_weakPlatVertical.objects.forEach(plat => {
            const newWeakPlatVertical = this.physics.add.sprite(plat.x + 32, plat.y + 192).setSize(64, 192).setOffset(64, 0).setPipeline('Light2D').setImmovable(true).setPushable(false).setTexture("weakPlatVertical", 0);
            weakPlatsVertical.add(newWeakPlatVertical);
            newWeakPlatVertical.body.setAllowGravity(false);


            //weakPlatsVertical.create(plat.x + 32, plat.y + 96, "weakPlatVertical").setSize(64, 192).setPipeline('Light2D');
        })

        // plateformes destructibles si Frog wall jump dessus
        layer_nextLevel.objects.forEach(nextlvl => {
            nextLevel.create(nextlvl.x + 32, nextlvl.y - 96).setVisible(false).setSize(64, 320);
        })

        return { spawnFrog, spawnHog, spawnRaven, spawnButton, spawnButtonBase, checkpointFrog, checkpointHog, checkpointRaven, nextLevel, layer_platforms, layer_boxStop, layer_limits, layer_deadZone, boxes, bigBoxes, stakes, spawnCure, breaks, pics, ravenPlats, /*movingPlats,*/ weakPlats, weakPlatsVertical, layer_movingPlats, buttonBases, buttons, spawnDoor, tileset }
    }

    loadVar(layers) {

        // Pour activer les contrôles manettes
        this.controller = false;

        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        this.possessFrogSound = this.sound.add('possessFrogSound');
        this.possessHogSound = this.sound.add('possessHogSound');
        this.possessRavenSound = this.sound.add('possessRavenSound');

        this.deathFrogSound = this.sound.add('deathFrogSound');
        this.deathHogSound = this.sound.add('deathHogSound');
        this.deathRavenSound = this.sound.add('deathRavenSound');

        this.checkPointSound = this.sound.add('checkPointSound');

        this.unlockFrogCP = false;
        this.unlockHogCP = false;
        this.unlockRavenCP = false;

        // quand le mob se déplace au cours de phases "scénarisées" => fins de niveaux, boutons, etc...
        this.writtenMoveRight = false;
        this.writtenMoveLeft = false;

        this.counterVictory = 0;

        // Variables pour possession 
        this.playerKilled = false;
        this.hasSaveMob = false; // => si un mob est possédé ou non (mob possédé = saveMob)

        // item de soin collectable
        this.cure = this.physics.add.sprite(layers.spawnCure.x + 32, layers.spawnCure.y + 32, 'cure').setDepth(1);

        this.cure.body.setAllowGravity(false)
            .setCollideWorldBounds(true);

        // Système portes / Boutons
        this.buttonOn = false;
        this.mobPressingButton = false;
        this.boxPressingButton = false;
        this.firstDisableDoor = false;

        this.boxCurrentlyPressingButton = false;
        this.mobCurrentlyPressingButton = false;
        this.doorCurrentlyOpening = false;

        this.door = this.physics.add.sprite(layers.spawnDoor.x + 32, layers.spawnDoor.y + 96, "door").setImmovable(true);
        this.door.body.setAllowGravity(false)
            .setCollideWorldBounds(true);

        // Projectiles
        this.projectilesMob = new Phaser.GameObjects.Group;
        this.projectilesPlayer = new Phaser.GameObjects.Group;

        this.hookCollideMovingPlat = false;

        this.speedItem = 0;

        this.physics.add.collider(this.projectilesMob, layers.ravenPlats, this.createPlat, null, this);

        this.physics.add.collider(this.projectilesMob, layers.layer_platforms, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.boxes, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.bigBoxes, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.weakPlats, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.weakPlatsVertical, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.pics, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.pics, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, layers.breaks, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, this.door, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, this.movingPlat1, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, this.movingPlat2, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, this.movingPlat3, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, this.movingPlat4, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesMob, this.movingPlat5, this.cleanProj, null, this);

        this.physics.add.collider(this.projectilesPlayer, layers.ravenPlats, this.createPlat, null, this);

        this.physics.add.collider(this.projectilesPlayer, layers.layer_platforms, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.boxes, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.bigBoxes, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.weakPlats, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.weakPlatsVertical, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.pics, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.pics, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, layers.breaks, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, this.door, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, this.movingPlat1, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, this.movingPlat2, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, this.movingPlat3, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, this.movingPlat4, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, this.movingPlat5, this.cleanProj, null, this);

        // PLAYER ET MOB pour certains colliders
        this.playerGroup = this.physics.add.group();
        this.mobGroup = this.physics.add.group();

        //this.nextLevel = this.physics.add.staticSprite(layers.nextLevel.x + 32, layers.nextLevel.y - 96).setVisible(false).setSize(64, 320);
        this.mouseOverMob = false;

        // PLUS DE CURSEUR
        const canvas = this.sys.canvas;
        canvas.style.cursor = "none";

        // LUMIERES
        // lumière ambiante
        this.lights.enable().setAmbientColor(0xffffff);

        this.lightMouse = this.lights.addLight(0, 0, 95, 0x00aaff, 10).setVisible(true);

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
        }, this);

        this.checkPoint = true;

        // lumière mouse over au-dessus des mobs possédables
        //this.lightMouseOver = this.lights.addLight(300, 250, 200, 0x00aaff, 5);

        //  this.ambiantLight = this.lights.addLight(0, 0, 100000, 0xffffff, 1)

        //this.lightPlayer = this.lights.addLight(300, 250, 200, 0, 0.5);
    }

    // Appelée au chargement de chaque scène, et quand on switch de possession de mob 
    createMob(nameMob, x, y, layers, facing, currentMob, isCorrupted, haveCure) {

        if (currentMob == "frog") {
            nameMob = new MobFrog(this, x, y, facing, currentMob, isCorrupted, haveCure)
                .setOrigin(0, 0)
                .setSize(48, 64)
                .setOffset(38, 32);
        }
        else if (currentMob == "hog") {
            nameMob = new MobHog(this, x, y, facing, currentMob, isCorrupted, haveCure)
                .setOrigin(0, 0)
                .setSize(128, 96)
                .setOffset(64, 64);
        }
        else if (currentMob == "raven") {
            nameMob = new MobRaven(this, x, y, facing, currentMob, isCorrupted, haveCure)
                .setOrigin(0, 0)
                .setSize(64, 96)
                .setOffset(64, 64);
        }

        this.mobGroup.add(nameMob);

        nameMob.setCollideWorldBounds(true);

        /*const particuleMouseOver = this.add.particles('particule_test').setDepth(-1).createEmitter({
            follow : nameMob, 
            lifespan: 2000,
            alpha: 0.2,
            quantity: 1,
            blendMode : 'ADD'
        });*/

        /*const lightMouseOver = this.lights.addLight( {
            x : nameMob.x,
            y : nameMob.y,
            radius : 200,
            rgb : 0x00aaff,
            intensity : 10,
            follow : nameMob,
            visible : true,
        });*/

        //this.lightMouseOver.setFollow(nameMob);

        this.time.delayedCall(1500, () => {
            nameMob.justCreated = false;
        });

        if (isCorrupted) {
            nameMob.setTint(0xdc143c);
            nameMob.setAlpha(0)
        }

        if (!isCorrupted) { // un mob corrompu ne peut pas être possédé

            //nameMob.setTint(0x66cdaa); // test 1
            //nameMob.setTint(0x8fbc8f); // test 3 => le pire
            //nameMob.setTint(0x00fa9a) // test 4 => pas mal mais trop vert
            nameMob.setTint(0x48d1cc); // test 2 => celui là l'emporte
            nameMob.setAlpha(0);

            nameMob
                .setInteractive() // on peut cliquer dessus
                .on('pointerover', () => {
                    this.lightMouse.setColor(0x46f264)
                        .setIntensity(25);

                    this.mouseOverMob = true;
                })

                .on('pointerout', () => {
                    this.lightMouse.setColor(0x00aaff)
                        .setIntensity(10);

                    this.mouseOverMob = false;
                })

                .on('pointerdown', function () {

                    nameMob.disableIA(); // désactive le update du mob pour éviter un crash

                    if (this.activePossession) { // si on possède actuellement un mob...
                        if (this.hasSaveMob) { // ... et qu'il n'est pas notre 1st possession, on remplace notre sprite "player" par celui du mob préalablement possédé
                            this.replaceMobBySaveMob(this.player, layers, this.saveMob);
                        }
                        else if (!this.hasSaveMob) { // ... et qu'il est notre 1st possession, on crée un nouveau mob à partir du player
                            this.replaceMobByPlayer(this.player, layers);
                        }
                    }
                    // possession du mob
                    this.possessMob(nameMob, nameMob.x, nameMob.y, this.layers);
                }, this)
        }

        this.tweens.add({
            targets: nameMob,
            alpha: 0.8,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        // COLLIDERS ET OVERLAPS

        this.physics.add.overlap(nameMob, this.playerGroup, this.checkCharge, null, this);

        // Calques layers
        this.physics.add.collider(nameMob, layers.layer_platforms, this.removePressButtons, null, this);
        this.physics.add.collider(nameMob, layers.layer_limits);
        this.physics.add.collider(nameMob, layers.layer_deadZone, this.kill, null, this);

        // collision boxes
        this.physics.add.collider(nameMob, layers.boxes, this.pushBox, null, this);
        this.physics.add.collider(nameMob, layers.bigBoxes, this.pushBox, null, this);

        // collisions obstacles brisables
        this.physics.add.collider(nameMob, layers.breaks, this.destroyIfCharge, null, this);

        this.physics.add.overlap(nameMob, this.cure, this.isCured, null, this);

        // Projectiles et pics qui tuent au contact
        this.physics.add.collider(this.projectilesPlayer, nameMob, this.hitProjectile, null, this);
        this.physics.add.collider(nameMob, layers.pics, this.kill, null, this);

        // Système de boutons et porte qui bloque
        this.physics.add.collider(nameMob, layers.buttonBases);
        this.physics.add.collider(nameMob, layers.buttons, this.pressButtonsMob, null, this);
        this.physics.add.collider(nameMob, this.door);

        // Plateformes

        this.physics.add.collider(nameMob, layers.weakPlats, this.destroyPlat, null, this);
        this.physics.add.collider(nameMob, layers.weakPlatsVertical);

        this.physics.add.collider(nameMob, this.movingPlat1);
        this.physics.add.collider(nameMob, this.movingPlat2);
        this.physics.add.collider(nameMob, this.movingPlat3);
        this.physics.add.collider(nameMob, this.movingPlat4);
        this.physics.add.collider(nameMob, this.movingPlat5);
    }


    // appelée à chaque POSSESSION de mob
    createPlayer(x, y, layers, facing, currentMob, haveCure) {

        if (!this.activePossession) {
            this.player.enableBody();
        }

        if (currentMob == "frog") {

            this.possessFrogSound.play();

            this.player = new PlayerFrog(this, x, y, facing, currentMob, haveCure)
                .setAlpha(0)
                .setOrigin(0, 0)
                .setSize(48, 64)
                .setOffset(38, 32);
        }
        else if (currentMob == "hog") {

            this.possessHogSound.play();

            this.player = new PlayerHog(this, x, y, facing, currentMob, haveCure)
                .setAlpha(0)
                .setOrigin(0, 0)
                .setSize(128, 96)
                .setOffset(64, 64);
        }
        else if (currentMob == "raven") {

            this.possessRavenSound.play();

            this.player = new PlayerRaven(this, x, y, facing, currentMob, haveCure)
                .setAlpha(0)
                .setOrigin(0, 0)
                .setSize(64, 96)
                .setOffset(64, 64);
        }

        this.playerGroup.add(this.player);

        this.tweens.add({
            targets: this.player,
            alpha: 0.8,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        //this.lightPlayer  = this.lights.addLight(this.player.x, this.player.y, 200, 0x00aaff, 10);
        //this.player.setPipeline('Light2D');

        this.player.setCollideWorldBounds(true);

        this.time.delayedCall(500, () => {
            this.player.justCreated = false;
        });

        this.emitterPlayer = this.add.particles("particule_cursor").setDepth(-1).createEmitter({
            //follow: this.player,
            //followOffset : x: 32, y: 0,
            lifespan: 500,
            alpha: 0.10,
            frequency: 1,
            quantity: 1,
            blendMode: 'COLOR_BURN',
        });

        // COLLIDERS ET OVERLAPS

        this.physics.add.overlap(this.player, this.mobGroup, this.checkCharge, null, this);

        this.physics.add.collider(this.player, layers.layer_platforms, this.removePressButtons, null, this); // player > plateformes
        this.physics.add.collider(this.player, layers.layer_deadZone, this.kill, null, this);

        // collision boxes
        this.physics.add.collider(this.player, layers.boxes, this.pushBox, null, this);
        this.physics.add.collider(this.player, layers.bigBoxes, this.pushBox, null, this);

        // collisions obstacles brisables
        this.breakCollisions = this.physics.add.collider(this.player, layers.breaks, this.destroyIfCharge, null, this);

        // Projectiles et pics qui tuent au contact
        this.physics.add.collider(this.projectilesMob, this.player, this.hitProjectile, null, this);
        this.physics.add.collider(this.player, layers.pics, this.kill, null, this);

        // Item à récupérer en overlap
        this.physics.add.overlap(this.player, this.cure, this.getCure, null, this);

        // Système de boutons et porte qui bloque
        this.physics.add.collider(this.player, layers.buttonBases, this.mobClimbButtonBase, null, this);
        this.physics.add.collider(this.player, layers.buttons, this.pressButtonsMob, null, this);
        this.physics.add.collider(this.player, this.door);

        this.physics.add.overlap(this.player, layers.stakes, () => { this.player.reachStake = true }, null, this);

        if (this.player.currentMob == "frog") {
            this.physics.add.overlap(this.player, layers.checkpointFrog, this.saveCheckPoint, null, this);
        }

        if (this.player.currentMob == "hog") {
            this.physics.add.overlap(this.player, layers.checkpointHog, this.saveCheckPoint, null, this);
        }

        if (this.player.currentMob == "raven") {
            this.physics.add.overlap(this.player, layers.checkpointRaven, this.saveCheckPoint, null, this);
        }

        if (currentMob == "frog") {
            // collision hook et stake = grappin
            this.physics.add.overlap(this.player.hook, layers.stakes, this.goToHook, null, this);
            this.physics.add.overlap(this.player.hook, layers.boxes, this.attrackHook, null, this);
            this.physics.add.collider(this.player.hook, layers.layer_platforms);
            this.physics.add.collider(this.player.hook, layers.breaks);
            this.physics.add.collider(this.player.hook, layers.pics);
            this.physics.add.collider(this.player.hook, layers.bigBox);
            this.physics.add.collider(this.player.hook, layers.mobGroup);
            this.physics.add.collider(this.player.hook, this.movingPlat1, this.cleanHook, null, this);
            this.physics.add.collider(this.player.hook, this.movingPlat2, this.cleanHook, null, this);
            this.physics.add.collider(this.player.hook, this.movingPlat3, this.cleanHook, null, this);
            this.physics.add.collider(this.player.hook, this.movingPlat4, this.cleanHook, null, this);
            this.physics.add.collider(this.player.hook, this.movingPlat5, this.cleanHook, null, this);
            this.physics.add.collider(this.player.hook, this.door);
            this.physics.add.collider(this.player.hook, layers.weakPlatsVertical);
        }

        // Plateformes

        this.weakPlatsColliders = this.physics.add.collider(this.player, layers.weakPlats, this.destroyPlat, null, this);
        this.weakPlatVerticalCollider = this.physics.add.collider(this.player, layers.weakPlatsVertical, this.destroyVerticalPlat, null, this);

        this.physics.add.collider(this.player, layers.ravenPlat);

        this.physics.add.collider(this.player, this.movingPlat1);
        this.physics.add.collider(this.player, this.movingPlat2);
        this.physics.add.collider(this.player, this.movingPlat3);
        this.physics.add.collider(this.player, this.movingPlat4);
        this.physics.add.collider(this.player, this.movingPlat5);

        this.physics.add.overlap(this.player, layers.nextLevel, this.startNextLevel, null, this);
    }

    // METHODES POUR POSSESSION DE MOBS --------------

    // POSSEDER MOB - On détruit le mob, et on crée un player à la place
    possessMob(mob, mobX, mobY, layers) {
        this.saveMob = mob; // permet de sauvegarder toutes les infos liées au mob, pour le recréer plus tard
        mob.destroy();
        //const nature = currentMob; // permet de sauvegarder quel type de mob recréer plus tard
        this.createPlayer(mobX, mobY, layers, mob.facing, mob.currentMob, mob.haveCure);
        this.activePossession = true;
    }

    // POSSEDER AUTRE MOB - On détruit le player, et on crée un mob à la place (en utilisant le mob sauvegardé préalablement dans le possessMob)
    replaceMobBySaveMob(player, layers, possessedMob) {

        if (player.haveCure) {
            player.haveCure = false;

            this.cure.setVelocity(0, 0);

            if (player.currentMob == "frog") {
                this.dropCureX = player.x + 64;
                this.dropCureY = player.y + 32;
            }

            if (player.currentMob == "hog") {
                this.dropCureX = player.x + 128;
                this.dropCureY = player.y + 96;
            }

            if (player.currentMob == "raven") {
                this.dropCureX = player.x + 96;
                this.dropCureY = player.y + 96;
            }

            this.tweens.add({
                targets: this.cure,
                x: this.dropCureX,
                y: this.dropCureY,
                scale: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

        player.disablePlayer(); // permet de désactiver le update du player pour éviter un crash
        player.destroy();
        this.createMob(possessedMob, player.x, player.y, layers, player.facing, possessedMob.currentMob, possessedMob.isCorrupted, player.haveCure);
    }

    replaceMobByPlayer(player, layers) {
        if (player.haveCure) {
            player.haveCure = false;

            this.cure.setVelocity(0, 0);

            if (player.currentMob == "frog") {
                this.dropCureX = player.x + 64;
                this.dropCureY = player.y + 32;
            }

            if (player.currentMob == "hog") {
                this.dropCureX = player.x + 128;
                this.dropCureY = player.y + 96;
            }

            if (player.currentMob == "raven") {
                this.dropCureX = player.x + 96;
                this.dropCureY = player.y + 96;
            }

            this.tweens.add({
                targets: this.cure,
                x: this.dropCureX,
                y: this.dropCureY,
                scale: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

        player.disablePlayer(); // permet de désactiver le update du player pour éviter un crash
        player.destroy();
        this.createMob(this.mob1, player.x, player.y, layers, player.facing, player.currentMob, player.isCorrupted, player.haveCure);
        this.hasSaveMob = true;
    }

    // METHODES POUR BOUTONS ET PORTES

    // permet aux boîtes de monter automatiquement les supports de boutons
    boxClimbButtonBase(box, baseButton) {
        if (box.body.blocked.left || box.body.blocked.right) {
            this.tweens.add({
                targets: box,
                y: box.y -= 8,
                duration: 50,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }
    }

    mobClimbButtonBase(mob, baseButton) {
        if (mob.body.blocked.left || mob.body.blocked.right) {

            this.tweens.add({
                targets: mob,
                y: mob.y -= 8,
                duration: 50,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            mob.climbButton = true;
        }
    }

    // Boîte qui presse un bouton
    pressButtonsBox(box, button) {

        if (box.body.blocked.left || box.body.blocked.right) {
            box.setImmovable(false);

            this.tweens.add({
                targets: box,
                y: box.y -= 8,
                duration: 50,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

        // si la boxe ne rencontre pas de collision à guache, à droite et que le mob n'est pas déjà en train de presser le bouton
        if (!box.body.blocked.left && !box.body.blocked.right && !this.mobPressingButton) {

            this.boxPressingButton = true;

            // on centre la box sur le bouton
            if (!this.boxCurrentlyPressingButton) {
                
                this.boxCurrentlyPressingButton = true;

                // TWEEN
                this.tweens.add({
                    targets: box,
                    x: this.layers.spawnButton.x + 64,
                    duration: 500,
                    ease: 'Linear',
                });
            }

            // Animation pression du bouton
            if (!this.mobCurrentlyPressingButton) {

                this.mobCurrentlyPressingButton = true;

                // TWEEN
                this.tweens.add({
                    targets: button,
                    y: this.layers.spawnButton.y - 8,
                    delay: 500,
                    ease: 'Linear',
                });
            }

            box.destroy();

            // création d'une boxe qu'on ne pourra pas bouger

            if (this.player.currentMob == "hog") {
                this.spawnNewBoxX = 54;
            }
            else if (this.player.currentMob == "frog") {
                this.spawnNewBoxX = 0;
            }

            const boxPressingButton = this.physics.add.sprite(box.x - this.spawnNewBoxX, box.y, "box").setPushable(false).setPipeline('Light2D').setSize(50, 49).setOffset(5, 0);

            this.physics.add.collider(this.layers.buttons, boxPressingButton, this.climbBoxButton, null, this);
            this.physics.add.collider(this.playerGroup, boxPressingButton);
            this.physics.add.collider(this.mobGroup, boxPressingButton);
            this.physics.add.collider(this.projectilesMob, boxPressingButton, this.cleanProj, null, this);
            this.physics.add.collider(this.projectilesPlayer, boxPressingButton, this.cleanProj, null, this);
            //this.physics.add.collider(this.player.hook, boxPressingButton, this.cleanHook, null, this)


            // Activation de l'ouverture de la porte
            this.time.delayedCall(600, () => {
                this.buttonOn = true;
            });
        }
    }

    // Mob qui presse un bouton
    pressButtonsMob(mob, button) {
        // permet de monter automatiquement les supports de boutons sans sauter
        if (mob.body.blocked.left || mob.body.blocked.right) {

            this.tweens.add({
                targets: mob,
                y: mob.y -= 8,
                duration: 50,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

        // Verification qu'on est bien SUR le bouton, et pas collé à gauche ou à droite
        if (!mob.body.blocked.left && !mob.body.blocked.right) {

            // SI HOG
            if (mob.currentMob == "hog") {
                if (mob.isPossessed && !this.boxPressingButton) {

                    this.mobPressingButton = true;

                    // placement du mob sur le bouton

                    if (button.x < mob.x + 128 && !mob.currentlyPressing) {

                        // fais en sorte de ne pas boucler cette partie du code
                        mob.currentlyPressing = true;

                        //ANIMATION & PLACEMENT

                        this.writtenMoveLeft = true;
                        this.facing = "left";

                        // TWEEN
                        this.tweens.add({
                            targets: mob,
                            x: this.layers.spawnButton.x - 64,
                            duration: 500,
                            ease: 'Linear',
                        });
                    }

                    // placement du mob sur le bouton

                    else if (button.x > mob.x + 128 && !mob.currentlyPressing) {

                        // fais en sorte de ne pas boucler cette partie du code
                        mob.currentlyPressing = true;

                        //ANIMATION & PLACEMENT
                        this.writtenMoveRight = true;
                        this.facing = "right";

                        // TWEEN
                        this.tweens.add({
                            targets: mob,
                            x: this.layers.spawnButton.x - 64,
                            duration: 500,
                            ease: 'Linear',
                        });
                    }

                    // immobilisation du mob pour un temps
                    mob.inputsMoveLocked = true;
                    mob.canJump = false;

                    // Animation pression du bouton
                    if (!this.mobCurrentlyPressingButton) {

                        this.mobCurrentlyPressingButton = true;

                        // TWEEN
                        this.tweens.add({
                            targets: button,
                            y: this.layers.spawnButton.y - 8,
                            delay: 500,
                            ease: 'Linear',
                        });
                    }

                    // Activation de l'ouverture de la porte
                    this.time.delayedCall(600, () => {

                        this.writtenMoveRight = false;
                        this.writtenMoveLeft = false;

                        mob.isPressingButton = true;
                        this.buttonOn = true;

                        mob.inputsMoveLocked = false;
                        mob.canJump = true;

                    });
                }

                else {
                    // TWEEN

                    mob.isPressingButton = true;
                    this.mobPressingButton = true;
                    this.buttonOn = true;
                }

            }

            // SI RAVEN OU FROG
            else if (mob.isPossessed && !mob.isPressingButton && !this.boxPressingButton) {

                mob.isPressingButton = true;

                // TWEEN
                this.tweens.add({
                    targets: button,
                    y: this.layers.spawnButton.y - 20,
                    duration: 100,
                    ease: 'Linear',
                });

                this.time.delayedCall(100, () => {
                    this.tweens.add({
                        targets: button,
                        y: this.layers.spawnButton.y - 26,
                        duration: 100,
                        ease: 'Linear',
                    });
                });
            }
        }
    }

    removePressButtons(mob) { // si on quitte le bouton
        if (mob.currentMob == "hog") {
            mob.currentlyPressing = false;
            this.mobPressingButton = false;
        }
        mob.isPressingButton = false;
        mob.climbButton = false;
    }

    boxOnFloor(box) { // désactive la pression du bouton si bouton quitte le bouton
        // immobilise la box quand on ne la pousse pas
        if (box.body.blocked.down) {
            if (box.body.blocked.right || box.body.blocked.left) {
                //box.body.setImmovable(true);
                box.setVelocityX(0);
            }
            box.setDragX(0.0001);
        }
    }

    manageDoor(layers) { // door qui s'ouvre ou non en fonction de buttonOn

        if (!this.mobPressingButton && !this.boxPressingButton && this.mobCurrentlyPressingButton) {

            this.mobCurrentlyPressingButton = false;

            // TWEEN
            this.tweens.add({
                targets: this.layers.buttons,
                y: this.layers.spawnButton.y - 24,
                duration: 500,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

        }

        if (layers.buttons.body.touching.up && (this.mobPressingButton || this.boxPressingButton) && !this.doorCurrentlyOpening && this.buttonOn) {

            this.doorCurrentlyOpening = true;

            this.tweens.add({
                targets: this.door,
                y: layers.spawnDoor.y + 288,
                duration: 1500,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            //this.door.disableBody(true, true);
            if (!this.firstDisableDoor) {
                this.firstDisableDoor = true;
            }
        }
        else if (this.firstDisableDoor && !this.mobPressingButton && !this.boxPressingButton && this.doorCurrentlyOpening) {

            this.doorCurrentlyOpening = false;

            this.tweens.add({
                targets: this.door,
                y: layers.spawnDoor.y + 96,
                duration: 1500,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            //this.door.enableBody();
            this.door.visible = true;
            this.buttonOn = false;
        }
    }

    // METHODES DE MORT ET DE RESPAWN

    kill(victim, killer) { // tue les mobs et les players

        if (!victim.isDying) {
            this.tweens.add({
                targets: victim,
                alpha: 0,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            if (victim.currentMob == "frog" && victim.isPossessed) {
                this.tweens.add({
                    targets: this.player.rope,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
                this.tweens.add({
                    targets: this.player.rope2,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.tweens.add({
                    targets: this.player.rope3,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.tweens.add({
                    targets: this.player.rope4,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
                this.tweens.add({
                    targets: this.player.rope5,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
                this.tweens.add({
                    targets: this.player.hook,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });
            }

            if (victim.currentMob == "frog") {
                this.deathFrogSound.play();
            }
            else if (victim.currentMob == "hog") {
                this.deathHogSound.play();
            }
            else if (victim.currentMob == "raven") {
                this.deathRavenSound.play();
            }

            this.time.delayedCall(300, () => {

                victim.destroy();

                if (victim.currentMob == "frog" && victim.isPossessed) {

                    this.player.rope.destroy()
                    this.player.rope2.destroy();
                    this.player.rope3.destroy();
                    this.player.rope4.destroy();
                    this.player.rope5.destroy();
                    this.player.hook.destroy();
                }

                // si un mob meurt
                if (!victim.isPossessed) {
                    victim.disableIA();
                }

                // si un player meurt
                else if (victim.isPossessed) {
                    victim.disablePlayer();
                    this.playerKilled = true;
                    this.player = new Player(this, 0, 0, "right", "frog", false).disableBody(true, true);

                    this.time.delayedCall(100, () => {
                        this.activePossession = false;
                        this.playerKilled = false;
                    });
                }
            });














































            if (victim.haveCure == true) {

                this.cure.setVelocity(0, 0);

                this.tweens.add({
                    targets: this.cure,
                    alpha: 0,
                    duration: 300,  // Durée de l'animation en millisecondes
                    ease: 'Linear', // Fonction d'interpolation pour l'animation
                });

                this.time.delayedCall(500, () => {
                    this.cure.x = this.layers.spawnCure.x + 32;
                    this.cure.y = this.layers.spawnCure.y;
                    this.cure.setScale(1).setAlpha(1).setVelocity(0, 0);
                });

            }

            this.respawnMob(victim);

            victim.isDying = true;
        }
    }

    respawnMob(target) { // fait respawn mobs à leur spawn initial après la mort du player ou d'un mob

        this.time.delayedCall(500, () => {
            if (target.currentMob == "frog") {
                this.createMob(target, this.layers.spawnFrog.x - 64, this.layers.spawnFrog.y - 64, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
            else if (target.currentMob == "hog") {
                this.createMob(target, this.layers.spawnHog.x - 64, this.layers.spawnHog.y - 64, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
            else if (target.currentMob == "raven") {
                this.createMob(target, this.layers.spawnRaven.x - 64, this.layers.spawnRaven.y - 64, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
        });
    }

    saveCheckPoint(player, checkPoint) {
        if (player.currentMob == "frog" && !this.unlockFrogCP) {

            this.layers.spawnFrog.x = checkPoint.x;
            this.layers.spawnFrog.y = checkPoint.y;

            this.unlockFrogCP = true;

            this.checkPointSound.play();

            this.tweens.add({
                targets: checkPoint,
                alpha: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

        if (player.currentMob == "hog" && !this.unlockHogCP) {

            this.layers.spawnHog.x = checkPoint.x;
            this.layers.spawnHog.y = checkPoint.y;

            this.unlockHogCP = true;

            this.checkPointSound.play();

            this.tweens.add({
                targets: checkPoint,
                alpha: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

        if (player.currentMob == "raven" && !this.unlockRavenCP) {

            this.layers.spawnRaven.x = checkPoint.x;
            this.layers.spawnRaven.y = checkPoint.y;

            this.unlockRavenCP = true;

            this.checkPointSound.play();

            this.tweens.add({
                targets: checkPoint,
                alpha: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }

    }

    // METHODES POUR PURIFIER MOB

    getCure(player, cure) { // récupération de l'item de soin
        if (!this.player.haveCure && Phaser.Input.Keyboard.JustDown(this.player.keyE)) {

            this.tweens.add({
                targets: this.cure,
                scale: 0.7,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            this.player.haveCure = true;
        }
    }

    dropCure() { // dépose l'item de soin
        if (this.player.haveCure && this.player.onGround && Phaser.Input.Keyboard.JustDown(this.player.keyE)) {

            this.player.haveCure = false;

            this.cure.setVelocity(0, 0);

            if (this.player.currentMob == "frog") {
                this.dropCureX = this.player.x + 64;
                this.dropCureY = this.player.y + 32;
            }

            if (this.player.currentMob == "hog") {
                this.dropCureX = this.player.x + 128;
                this.dropCureY = this.player.y + 96;
            }

            if (this.player.currentMob == "raven") {
                this.dropCureX = this.player.x + 96;
                this.dropCureY = this.player.y + 96;
            }

            this.tweens.add({
                targets: this.cure,
                x: this.dropCureX,
                y: this.dropCureY,
                scale: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });
        }
    }

    isCured(mob, cure) { // si un mob corrompu entre en contact => guéri

        if (mob.isCorrupted) {

            mob.isCorrupted = false;

            this.tweens.add({
                targets: this.cure,
                alpha: 0,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            this.tweens.add({
                targets: mob,
                alpha: 0,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            mob.disableIA();

            this.time.delayedCall(300, () => {
                cure.destroy();
                mob.destroy();
            });

            this.createMob(mob, mob.x, mob.y, this.layers, mob.facing, mob.currentMob, false, mob.haveCure);
        }
    }

    // METHODES POUR LES PLATEFORMES FRAGILES

    destroyPlat(player, platform) {

        if (player.currentMob == "hog" && player.onGround && !this.treeBreaking) {
            this.treeBreaking = true;
            this.physics.world.removeCollider(this.weakPlatsColliders);
            platform.anims.play("fallingTree_destroy");

            this.time.delayedCall(2000, () => {
                this.treeBreaking = false;
                this.weakPlatsColliders = this.physics.add.collider(this.player, this.layers.weakPlats, this.destroyPlat, null, this);;
                platform.anims.play("fallingTree_recreate", true);
            });
        }
    }

    destroyVerticalPlat(player, platform) {

        if ((player.currentMob == "frog" && (player.grabLeft || player.grabRight) && !this.verticalWallBreaking) || player.body.blocked.down && !this.verticalWallBreaking) {

            platform.disableBody(true, true);

            const temporaryPlatform = this.physics.add.sprite(platform.x, platform.y).setSize(64, 192).setOffset(64, 0).setPipeline('Light2D').setImmovable(true).setPushable(false).setTexture("weakPlatVertical", 0);
            temporaryPlatform.body.setAllowGravity(false);
            const weakPlatVerticalCollider = this.physics.add.collider(this.player, temporaryPlatform);

            temporaryPlatform.anims.play("weakPlatVertical_shake", true);

            this.time.delayedCall(500, () => {

                this.physics.world.removeCollider(weakPlatVerticalCollider);
                temporaryPlatform.anims.play("weakPlatVertical_destroy", true);
            });

            this.time.delayedCall(2500, () => {

                this.verticalWallBreaking = false;

                temporaryPlatform.destroy();
            });

            this.time.delayedCall(3000, () => {

                platform.enableBody(true, platform.x, platform.y, true, true);
                platform.setAlpha(0);
                platform.anims.play("weakPlatVertical_idle", true);

                this.tweens.add({
                    targets: platform,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Linear'
                })
            });
        }
    }

    // METHODES POUR PLAYER = FROG ----

    checkDistance(a, b) { // mesure la distance entre deux éléments
        let distance = Math.abs(a - b);
        return distance
    }

    // GRAPPIN qui bouge le grenouille vers le poteau
    goToHook(hook, stake) {

        this.player.stakeCatched = true;

        this.jumpHook = true;

        if (this.jumpHook && !this.playerKilled) {
            this.player.y = stake.y - 64;
            this.player.rope.y = stake.y;
            this.player.rope2.y = stake.y;
            this.player.rope3.y = stake.y;
            this.player.rope4.y = stake.y;
            this.player.rope5.y = stake.y;
            hook.y = stake.y;

            if (this.player.facing == 'right') {
                if (this.player.x + 32 < stake.x) {
                    this.player.x += 10
                    this.time.delayedCall(15, () => {
                        this.goToHook(hook, stake)
                    });
                }
                else {
                    this.jumpHook = false;
                    this.player.stakeCatched = false;
                }
            }
            else if (this.player.facing == 'left') {
                if (this.player.x + 96 > stake.x) {
                    this.player.x -= 10
                    this.time.delayedCall(15, () => {
                        this.goToHook(hook, stake)
                    });
                }
                else {
                    this.jumpHook = false;
                    this.player.stakeCatched = false;
                }
            }
        }
    }

    // GRAPPIN qui attire les boxes
    attrackHook(hook, box) {
        this.player.boxCatched = true;
        this.attrack = true;

        if (this.attrack) {
            if (this.player.facing == 'right') {
                if (this.player.x + 144 < box.x && !this.boxPressingButton) {

                    box.body.setAllowGravity(false);
                    box.x -= 10;
                    this.time.delayedCall(15, () => {
                        this.attrackHook(hook, box)
                    });
                }
                else {
                    box.body.setAllowGravity(true);
                    this.attrack = false;
                    this.player.boxCatched = false;
                }
            }
            else if (this.player.facing == 'left' && !this.boxPressingButton) {
                if (this.player.x - 16 > box.x) {
                    box.body.setAllowGravity(false);
                    box.x += 10;
                    this.time.delayedCall(15, () => {
                        this.attrackHook(hook, box)
                    });
                }
                else {
                    box.body.setAllowGravity(true);
                    this.attrack = false;
                    this.player.boxCatched = false;
                }
            }
        }
    }

    cleanHook(hook) {
        this.hookCollideMovingPlat = true;

        this.time.delayedCall(300, () => {
            this.hookCollideMovingPlat = false;
        });
    }

    // METHODES POUR PLAYER = HOG ---------------

    // si collision pendant charge, détruit l'objet et stop la charge
    destroyIfCharge(player, breaks) {
        if (player.isCharging && (player.body.touching.left || player.body.touching.right) && !this.wallBreaking) {

            this.wallBreaking = true;
            player.stopCharge()
            this.physics.world.removeCollider(this.breakCollisions);
            breaks.anims.play("breakingWall_destroy");

            this.time.delayedCall(2000, () => {
                breaks.destroy(breaks.x, breaks.y);
                this.wallBreaking = false;
            });
        }
    }

    checkCharge(hog, target) {
        if (hog.isCharging) {
            this.kill(target);
            hog.stopCharge();
        }
    }

    pushBox(player, box) {

        // si on contrôle le joueur => on peut pousser la boxe
        if (!player.isPossessed) {
            box.setImmovable(true);
            box.body.velocity.x = 0;
        }

        // si on contrôle le joueur => on peut pousser la boxe
        if (player.isPossessed) {
            // empêche le joueur de tressauter quand il est sur la caisse
            if (player.body.blocked.down && box.body.touching.up && !player.blockedLeft && !player.blockedLeft) {
                player.body.velocity.y = 0;
                box.body.setAllowGravity(false);
                box.setImmovable(true);
            }
            if ((player.body.blocked.right || player.body.blocked.left) && player.currentMob == "hog" && !player.isCharging) {
                box.setImmovable(false);
                box.body.setAllowGravity(true);
            }
            else if (player.currentMob != "hog") {
                box.setImmovable(true);
                box.body.velocity.x = 0;
            }
        }
    }

    climbBoxButton(player, box) {

        // si on contrôle le joueur => on peut pousser la boxe
        if (player.isPossessed) {
            // empêche le joueur de tressauter quand il est sur la caisse
            if (player.body.blocked.down && box.body.touching.up && !player.blockedLeft && !player.blockedLeft) {
                player.body.velocity.y = 0;
                box.body.setAllowGravity(false);
                box.setImmovable(true);
            }
        }
    }

    // METHODES POUR PLAYER = RAVEN ------

    /*createProj( shooter ) {
        const newProj = new Projectile(this, shooter.x + 64, shooter.y + 90, "feather").setOrigin(0, 0);

        return { newProj }
    }*/

    // crée une plateforme si on tire sur un élément de décor
    createPlat(proj, ravenPlat) {

        ravenPlat.destroy(ravenPlat.x, ravenPlat.y);
        proj.destroy();

        const solidRavenPlat = this.physics.add.staticSprite(ravenPlat.x, ravenPlat.y).setTexture("ravenPlat", 0).setDepth(1).setSize(128, 64).setOffset(-48, -32).setPipeline('Light2D');
        solidRavenPlat.anims.play("ravenPlat_on");
        this.physics.add.collider(this.playerGroup, solidRavenPlat);
        this.physics.add.collider(this.mobGroup, solidRavenPlat);
        this.physics.add.collider(this.projectilesMob, solidRavenPlat, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, solidRavenPlat, this.cleanProj, null, this);




        /*this.wallBreaking = true;
        player.stopCharge()
        this.treeBreaking = true;
        this.physics.world.removeCollider(this.breakCollisions);
        breaks.anims.play("breakingWall_destroy");

        this.time.delayedCall(2000, () => {
            breaks.destroy(breaks.x, breaks.y);
            this.wallBreaking = false;
        });*/

    }

    // tue la cible si projectile est atteint
    hitProjectile(projectile, target) {
        projectile.destroy();
        this.kill(target);
    }

    // détruit un projectile si collision
    cleanProj(projectile) {
        projectile.destroy();
    }

    // PASSAGE DE NIVEAU ---

    updateManager() {

        if (this.switchRavenPlatOn) {
            this.ravenPlatOn.enableBody();
        }

        this.manageDoor(this.layers);

        /*this.lightPlayer.x = this.player.x;
        this.lightPlayer.y = this.player.y;*/

        if (this.lightMouse.intensity > this.lightIntensity) {
            this.lightMouse.intensity -= 0.1
        }

        else if (this.lightMouse.intensity < this.lightIntensity) {
            this.lightMouse.intensity += 0.1
        }

        if (this.checkPoint) {

            if (!this.mouseOverMob) {
                this.lightIntensity = Phaser.Math.Between(8, 12);
            }

            if (this.mouseOverMob) {
                this.lightIntensity = Phaser.Math.Between(25, 28);
            }

            this.checkPoint = false;

            this.time.delayedCall(300, () => {
                this.checkPoint = true;
            });
        }

        if (this.activePossession && this.player.body.velocity.x != 0 && this.player.body.velocity.y != 0) {
            this.emitterPlayer.emitParticle();
        }

        // Item cure qui flotte autour du joueur
        if (this.player.haveCure) {

            if (this.player.facing == "left") {
                this.itemMoveX = 64;
            }

            else if (this.player.facing == "right") {

                if (this.player.currentMob == "frog") {
                    this.itemMoveX = - 64;
                }
                else if (this.player.currentMob == "hog") {
                    this.itemMoveX = 32;
                }
                else if (this.player.currentMob == "raven") {
                    this.itemMoveX = 0;
                }
            }

            this.physics.moveTo(this.cure, this.player.x + 64 + this.itemMoveX, this.player.y + 32, 350, 300);
        }
    }

    startNextLevel(player, detectionZone) {

        if (!this.writtenMoveRight) {

            if (this.mapName != "map_06") {

                this.cameras.main
                    .fadeOut(1500, 0, 0, 25) // fondu au noir

                this.player.inputsMoveLocked = true;
                this.writtenMoveRight = true;
                this.player.canJump = false;
                this.player.setCollideWorldBounds(false);

                this.time.delayedCall(1500, () => {

                    if (this.mapName == "map_01") {
                        this.scene.start("Level_02", {
                            mapName: "map_02", // nom de la map
                            mapTileset: "tileset", // nom du tileset sur TILED
                            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
                        });
                    }

                    if (this.mapName == "map_02") {
                        this.scene.start("Level_05", {
                            mapName: "map_05", // nom de la map
                            mapTileset: "tileset", // nom du tileset sur TILED
                            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
                        });
                    }

                    if (this.mapName == "map_03") {
                        this.scene.start("Level_04", {
                            mapName: "map_04", // nom de la map
                            mapTileset: "tileset", // nom du tileset sur TILED
                            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
                        });
                    }

                    if (this.mapName == "map_04") {
                        this.scene.start("Level_05", {
                            mapName: "map_05", // nom de la map
                            mapTileset: "tileset", // nom du tileset sur TILED
                            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
                        });
                    }

                    if (this.mapName == "map_05") {
                        this.scene.start("Level_06", {
                            mapName: "map_06", // nom de la map
                            mapTileset: "tileset", // nom du tileset sur TILED
                            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
                        });
                    }
                });
            }

            if (this.mapName == "map_06") {

                this.player.inputsMoveLocked = true;
                this.player.canJump = false;
                this.player.setCollideWorldBounds(false);
                this.writtenMoveRight = true;
                this.activePossession = false;

                if (this.counterVictory == 2) {
                    this.cameras.main
                        .fadeOut(1500, 0, 0, 25) // fondu au noir

                    this.time.delayedCall(1500, () => {
                        /*this.scene.start("Level_06", {
                            mapName: "map_06", // nom de la map
                            mapTileset: "tileset", // nom du tileset sur TILED
                            mapTilesetImage: "tileset_image", // nom du fichier image du tileset
                        });*/
                    });
                }
                else {
                    this.counterVictory += 1;

                    this.time.delayedCall(1500, () => {
                        this.writtenMoveRight = false;
                    });

                }
            }
        }
    }
}

export default SceneClass;