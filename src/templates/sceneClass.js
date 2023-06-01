import Player from "../entities/player.js";
import PlayerFrog from "../entities/playerFrog.js";
import PlayerHog from "../entities/playerHog.js";
import PlayerRaven from "../entities/playerRaven.js";

import Mob from "../entities/mob.js";
import MobFrog from "../entities/mobFrog.js";
import MobHog from "../entities/mobHog.js";
import MobRaven from "../entities/mobRaven.js";

class SceneClass extends Phaser.Scene {

    constructor(name) { // name = on reprend le nom qu'on trouve dans le constructeur du niveau
        super({
            key: name,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1600 },
                    debug: true,
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

        // CAMERA
        this.cameras.main
            .setBounds(0, 0, 3072, 1728) //format 16/9
            .setSize(3072, 1728)
            .setOrigin(0, 0)
            .fadeIn(1500, 0, 0, 25) // fondu au noir

        //Enlever commentaire pour voir la deadZone
        //this.cameras.main.setBounds(0, 192, 3072, 1920).setSize(3072, 1920).setOrigin(0, 0); 

        // ARRIERE PLAN - BACKGROUND
        this.background = this.add.tileSprite(0, 0, 3072, 1728, "background")
            .setPipeline('Light2D')
            .setOrigin(0, 0)
            .setDepth(-3); // profondeur

        // Tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // Calques layers
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset).setDepth(1).setPipeline('Light2D');
        const layer_decos1 = levelMap.createLayer("layer_decos1", tileset).setDepth(2).setPipeline('Light2D');
        const layer_decos2 = levelMap.createLayer("layer_decos2", tileset).setDepth(3).setPipeline('Light2D');
        const layer_limits = levelMap.createLayer("layer_limits", tileset).setVisible(false);
        const layer_deadZone = levelMap.createLayer("layer_deadZone", tileset);

        // Calques objets
        const layer_spawnFrog = levelMap.getObjectLayer("SpawnFrog");
        const layer_spawnHog = levelMap.getObjectLayer("SpawnHog");
        const layer_spawnRaven = levelMap.getObjectLayer("SpawnRaven");

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

        // NEXT LEVEL

        const nextLevel = layer_nextLevel.objects[0];

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

        const breaks = this.physics.add.staticGroup();
        const pics = this.physics.add.staticGroup();

        const cures = this.physics.add.staticGroup();

        // Plateformes spéciales

        const ravenPlats = this.physics.add.staticGroup();
        const weakPlats = this.physics.add.staticGroup();
        const weakPlatsVertical = this.physics.add.staticGroup();

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

        // Boxes normales        
        layer_box.objects.forEach(box => {
            const box_create = this.physics.add.sprite(box.x + 32, box.y, "box").setDamping(true).setImmovable(true).setPipeline('Light2D');

            this.physics.add.collider(box_create, this.movingPlat1);
            this.physics.add.collider(box_create, this.movingPlat2);
            this.physics.add.collider(box_create, this.movingPlat3);
            this.physics.add.collider(box_create, this.movingPlat4);

            this.physics.add.collider(box_create, buttonBases, this.climbButtonBase, null, this);
            this.physics.add.collider(box_create, buttons, this.pressButtonsBox, null, this);

            boxes.add(box_create);

            box_create.setCollideWorldBounds(true);

            this.physics.add.collider(boxes, layer_platforms, this.boxOnFloor, null, this);
            this.physics.add.collider(boxes, this.door);

        }, this)

        // Grosses boxes
        layer_bigBox.objects.forEach(bigBox => {

            const box_create = this.physics.add.sprite(bigBox.x + 32, bigBox.y, "bigBox").setDamping(true).setImmovable(true).setPipeline('Light2D');;

            this.physics.add.collider(box_create, this.movingPlat1);
            this.physics.add.collider(box_create, this.movingPlat2);
            this.physics.add.collider(box_create, this.movingPlat3);
            this.physics.add.collider(box_create, this.movingPlat4);
            this.physics.add.collider(box_create, buttonBases, this.climbButtonBase, null, this);
            this.physics.add.collider(box_create, buttons, this.pressButtonsBox, null, this);

            bigBoxes.add(box_create);

            box_create.setCollideWorldBounds(true);

            this.physics.add.collider(bigBoxes, layer_platforms, this.boxOnFloor, null, this);
            this.physics.add.collider(bigBoxes, this.door);
        }, this)

        // création des poteaux sur lesquels on peut se grappiner
        layer_stake.objects.forEach(stake => {
            const stake_create = this.physics.add.sprite(stake.x + 32, stake.y, "stake").setSize(32, 128).setPipeline('Light2D');

            this.physics.add.collider(stake_create, this.movingPlat1);
            this.physics.add.collider(stake_create, this.movingPlat2);
            this.physics.add.collider(stake_create, this.movingPlat3);
            this.physics.add.collider(stake_create, this.movingPlat4);

            stakes.add(stake_create);

            stake_create.setCollideWorldBounds(true);

            this.physics.add.collider(stakes, layer_platforms);
        }, this)

        // création des éléments destructibles (charge)
        layer_break.objects.forEach(break_create => {
            breaks.create(break_create.x + 64, break_create.y + 128, "break").setSize(128, 256).setPipeline('Light2D');
        }, this)

        // pics mortels
        layer_pics.objects.forEach(pic => {
            pics.create(pic.x + 32, pic.y - 32, "pic").setSize(48, 64);
        })

        // item de soin collectable
        layer_cure.objects.forEach(cure => {
            cures.create(cure.x + 32, cure.y, "cure").setDepth(1);
        })

        // création des plateformes qu'on peut créer en tirant dessus avec le raven
        layer_ravenPlat.objects.forEach(ravenPlat => {
            ravenPlats.create(ravenPlat.x + 54, ravenPlat.y + 54, "ravenPlatOff").setSize(64, 64).setOffset(10, 8).setPipeline('Light2D');
        }, this)

        // plateformes destructibles si Hog dessus
        layer_weakPlat.objects.forEach(plat => {
            weakPlats.create(plat.x + 96, plat.y + 16, "weakPlat").setSize(192, 32).setPipeline('Light2D');
        })

        // plateformes destructibles si Frog wall jump dessus
        layer_weakPlatVertical.objects.forEach(plat => {
            weakPlatsVertical.create(plat.x + 32, plat.y + 96, "weakPlatVertical").setSize(64, 192).setPipeline('Light2D');
        })

        return { spawnFrog, spawnHog, spawnRaven, nextLevel, layer_platforms, layer_limits, layer_deadZone, boxes, bigBoxes, stakes, cures, spawnCure, breaks, pics, ravenPlats, /*movingPlats,*/ weakPlats, weakPlatsVertical, layer_movingPlats, buttonBases, buttons, spawnDoor, tileset }
    }

    loadVar(layers) {

        // Pour activer les contrôles manettes
        this.controller = false;

        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        this.reachNewLevel = false;

        // Variables pour possession 
        this.playerKilled = false;
        this.hasSaveMob = false; // => si un mob est possédé ou non (mob possédé = saveMob)

        // Système portes / Boutons
        this.buttonOn = false;
        this.mobPressingButton = false;
        this.boxPressingButton = false;
        this.firstDisableDoor = false;

        this.door = this.physics.add.staticSprite(layers.spawnDoor.x + 32, layers.spawnDoor.y + 96, "door");

        // Projectiles
        this.projectilesMob = new Phaser.GameObjects.Group;
        this.projectilesPlayer = new Phaser.GameObjects.Group;

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

        // PLAYER ET MOB pour certains colliders
        this.playerGroup = this.physics.add.group();
        this.mobGroup = this.physics.add.group();

        this.nextLevel = this.physics.add.staticSprite(layers.nextLevel.x + 32, layers.nextLevel.y - 96).setVisible(false).setSize(64, 320);

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

        this.time.delayedCall(500, () => {
            nameMob.justCreated = false;
        });
        //this.jump(poids,blocCible)

        if (!isCorrupted) { // un mob corrompu ne peut pas être possédé

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

        this.physics.add.overlap(nameMob, layers.cures, this.isCured, null, this);

        // Projectiles et pics qui tuent au contact
        this.physics.add.collider(this.projectilesPlayer, nameMob, this.hitProjectile, null, this);
        this.physics.add.overlap(nameMob, layers.pics, this.kill, null, this);

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
    }


    // appelée à chaque POSSESSION de mob
    createPlayer(x, y, layers, facing, currentMob, haveCure) {

        if (!this.activePossession) {
            this.player.enableBody();
        }

        if (currentMob == "frog") {
            this.player = new PlayerFrog(this, x, y, facing, currentMob, haveCure)
                .setOrigin(0, 0)
                .setSize(48, 64)
                .setOffset(38, 32);
        }
        else if (currentMob == "hog") {
            this.player = new PlayerHog(this, x, y, facing, currentMob, haveCure)
                .setOrigin(0, 0)
                .setSize(128, 96)
                .setOffset(64, 64);
        }
        else if (currentMob == "raven") {
            this.player = new PlayerRaven(this, x, y, facing, currentMob, haveCure)
                .setOrigin(0, 0)
                .setSize(64, 96)
                .setOffset(64, 64);
        }

        this.playerGroup.add(this.player);

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
        this.physics.add.collider(this.player, layers.breaks, this.destroyIfCharge, null, this);

        // Projectiles et pics qui tuent au contact
        this.physics.add.collider(this.projectilesMob, this.player, this.hitProjectile, null, this);
        this.physics.add.overlap(this.player, layers.pics, this.kill, null, this);

        // Item à récupérer en overlap
        this.physics.add.overlap(this.player, layers.cures, this.getCure, null, this);

        // Système de boutons et porte qui bloque
        this.physics.add.collider(this.player, layers.buttonBases, this.climbButtonBase, null, this);
        this.physics.add.collider(this.player, layers.buttons, this.pressButtonsMob, null, this);
        this.physics.add.collider(this.player, this.door);

        if (currentMob == "frog") {
            // collision hook et stake = grappin
            this.physics.add.overlap(this.player.hook, layers.stakes, this.goToHook, null, this);
            this.physics.add.overlap(this.player.hook, layers.boxes, this.attrackHook, null, this);
            this.physics.add.collider(this.player.hook, layers.layer_platforms);
        }

        // Plateformes

        this.physics.add.collider(this.player, layers.weakPlats, this.destroyPlat, null, this);
        this.physics.add.collider(this.player, layers.weakPlatsVertical, this.destroyVerticalPlat, null, this);

        this.physics.add.collider(this.player, this.movingPlat1);
        this.physics.add.collider(this.player, this.movingPlat2);
        this.physics.add.collider(this.player, this.movingPlat3);
        this.physics.add.collider(this.player, this.movingPlat4);

        this.physics.add.overlap(this.player, this.nextLevel, this.startNextLevel, null, this);
    }

    // METHODES POUR POSSESSION DE MOBS --------------

    // POSSEDER MOB - On détruit le mob, et on crée un player à la place
    possessMob(mob, mobX, mobY, layers) {
        this.saveMob = mob; // permet de sauvegarder toutes les infos liées au mob, pour le recréer plus tard
        //const nature = currentMob; // permet de sauvegarder quel type de mob recréer plus tard
        mob.destroy();
        this.createPlayer(mobX, mobY, layers, mob.facing, mob.currentMob, mob.haveCure);
        this.activePossession = true;
    }

    // POSSEDER AUTRE MOB - On détruit le player, et on crée un mob à la place (en utilisant le mob sauvegardé préalablement dans le possessMob)
    replaceMobBySaveMob(player, layers, possessedMob) {
        player.disablePlayer(); // permet de désactiver le update du player pour éviter un crash
        player.destroy();
        this.createMob(possessedMob, player.x, player.y, layers, player.facing, possessedMob.currentMob, possessedMob.isCorrupted, player.haveCure);
    }

    replaceMobByPlayer(player, layers) {
        player.disablePlayer(); // permet de désactiver le update du player pour éviter un crash
        player.destroy();
        this.createMob(this.mob1, player.x, player.y, layers, player.facing, player.currentMob, player.isCorrupted, player.haveCure);
        this.hasSaveMob = true;
    }

    // METHODES POUR BOUTONS ET PORTES

    // permet aux boîtes de monter automatiquement les supports de boutons
    climbButtonBase(box, baseButton) {
        if (box.body.blocked.left || box.body.blocked.right) {
            box.y -= 8;
        }
    }

    // Boîte qui presse un bouton
    pressButtonsBox(box, button) {
        if (box.body.blocked.left || box.body.blocked.right) {
            box.setImmovable(false);
            box.y -= 8;
        }
        if (!box.body.blocked.left && !box.body.blocked.right && !this.mobPressingButton) {
            console.log("BOUTON PRESSE")
            this.buttonOn = true;
            this.boxPressingButton = true;
        }
    }

    // Mob qui presse un bouton
    pressButtonsMob(mob, button) {
        // permet de monter automatiquement les supports de boutons sans sauter
        if (mob.body.blocked.left || mob.body.blocked.right) {
            mob.y -= 8;
        }

        // Verification qu'on est bien SUR le bouton, et pas collé à gauche ou à droite
        if (!mob.body.blocked.left && !mob.body.blocked.right && !this.boxPressingButton) {

            // SI HOG
            if (mob.currentMob == "hog") {
                if (mob.isPossessed) {

                    // TWEEN
                    /*this.tweens.timeline({
                        targets: button.body.velocity,
                        tweens: [
                            { x: 0, y: +8, duration: 10, ease: 'Stepped'  },
                            { x: 0, y: 0, duration: 10, ease: 'Stepped' }
                        ]
                    });*/

                    //console.log("check Hog player")

                    mob.isPressingButton = true;
                    this.mobPressingButton = true;
                    this.buttonOn = true;
                }
                else {
                    // TWEEN

                    //console.log("check Hog mob")

                    mob.isPressingButton = true;
                    this.mobPressingButton = true;
                    this.buttonOn = true;
                }
            }

            // SI RAVEN OU FROG
            else if (mob.isPossessed) {
                console.log("check Frog player")
                // Petit mouvement de plaque, mais rien de plus
            }
            else {
                console.log("check Frog mob")
                // Petit mouvement de plaque, mais rien de plus
            }
        }
    }

    removePressButtons(mob) { // si on quitte le bouton
        if (mob.currentMob == "hog") {
            mob.isPressingButton = false;
            this.mobPressingButton = false;

            if (!this.boxPressingButton) {
                console.log("BOUTON ENLEVE");
                this.buttonOn = false;
            }
        }
    }

    boxOnFloor(box) { // désactive la pression du bouton si bouton quitte le bouton
        // immobilise la box quand on ne la pousse pas
        if (box.body.blocked.down) {
            if (box.body.blocked.right || box.body.blocked.left) {
                //box.body.setImmovable(true);
                box.setVelocity(0, 0);
            }
            box.setDragX(0.0001);

            // désactive le press bouton
            this.boxPressingButton = false;

            if (!this.mobPressingButton) {
                this.buttonOn = false;
            }
        }
    }

    manageDoor(layers) { // door qui s'ouvre ou non en fonction de buttonOn
        if (this.buttonOn) {
            this.door.disableBody(true, true);
            if (!this.firstDisableDoor) {
                this.firstDisableDoor = true;
            }
        }
        else if (this.firstDisableDoor && !this.buttonOn) {
            this.door.enableBody();
            this.door.visible = true;
        }
    }

    // METHODES DE MORT ET DE RESPAWN

    kill(victim) { // tue les mobs et les players
        victim.destroy();

        // si un mob meurt
        if (!victim.isPossessed) { victim.disableIA(); }

        // si un player meurt
        else if (victim.isPossessed) {
            victim.disablePlayer();
            this.playerKilled = true;
            this.player = new Player(this, 0, 0, "right", "frog", false).disableBody(true, true);

            setTimeout(() => {
                this.activePossession = false;
                this.playerKilled = false;
            }, 100);

            if (victim.haveCure == true) {
                setTimeout(() => {
                    const newCure = this.physics.add.staticSprite(this.layers.spawnCure.x + 32, this.layers.spawnCure.y, "cure").setDepth(1);
                    this.layers.cures.add(newCure);
                }, 500);
            }
        }

        this.respawnMob(victim);
    }

    respawnMob(target) { // fait respawn mobs à leur spawn initial après la mort du player ou d'un mob

        setTimeout(() => {
            if (target.currentMob == "frog") {
                this.createMob(target, this.layers.spawnFrog.x - 64, this.layers.spawnFrog.y - 64, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
            else if (target.currentMob == "hog") {
                this.createMob(target, this.layers.spawnHog.x - 64, this.layers.spawnHog.y - 64, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
            else if (target.currentMob == "raven") {
                this.createMob(target, this.layers.spawnRaven.x - 64, this.layers.spawnRaven.y - 64, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
        }, 500);
    }

    // METHODES POUR PURIFIER MOB

    getCure(player, cure) { // récupération de l'item de soin
        if (!this.player.haveCure && Phaser.Input.Keyboard.JustDown(this.player.keyE)) {
            cure.destroy();
            player.haveCure = true;
        }
    }

    dropCure() { // dépose l'item de soin
        if (this.player.haveCure && this.player.onGround && Phaser.Input.Keyboard.JustDown(this.player.keyE)) {

            this.player.haveCure = false;

            const newCure = this.physics.add.staticSprite(this.player.x + 64, this.player.y + 64, 'cure').setDepth(1);

            this.layers.cures.add(newCure);
        }
    }

    isCured(mob, cure) { // si un mob corrompu entre en contact => guéri

        if (mob.isCorrupted) {
            mob.disableIA();
            cure.destroy();
            mob.destroy();
            this.createMob(mob, mob.x, mob.y, this.layers, mob.facing, mob.currentMob, false, mob.haveCure);
        }
    }

    // METHODES POUR LES PLATEFORMES FRAGILES

    destroyPlat(player, platform) {
        if (player.currentMob == "hog" && player.onGround) {
            platform.disableBody();
            platform.visible = false;
            /*setTimeout(() => { 
                platform.destroy();
            }, 50);*/

            setTimeout(() => {
                platform.enableBody();
                platform.visible = true;
            }, 2000);
        }
    }

    destroyVerticalPlat(player, platform) {
        if (player.currentMob == "frog" && (player.grabLeft || player.grabRight)) {

            setTimeout(() => {
                platform.disableBody();
                platform.visible = false;
            }, 500);

            setTimeout(() => {
                platform.enableBody();
                platform.visible = true;
            }, 2000);
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

        hook.setVelocity(0);
        hook.disableBody(true, true);

        //this.rope.stop();
        hook.visible = false;
        //this.rope.visible = false;

        this.jumpHook = true;

        if (this.jumpHook) {
            if (this.player.facing == 'right') {
                if (this.player.x < stake.x) {
                    this.player.x += 6
                    this.time.delayedCall(15, () => {
                        this.goToHook(hook, stake)
                    });
                    //this.jump(poids,blocCible)
                }
                else {
                    this.jumpHook = false;
                    this.player.stakeCatched = false;
                }
            }
            else if (this.player.facing == 'left') {
                if (this.player.x > stake.x) {
                    this.player.x -= 6
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

        hook.setVelocity(0);
        hook.disableBody(true, true);

        //this.rope.stop();
        hook.visible = false;
        //this.rope.visible = false;

        this.attrack = true;

        if (this.attrack) {
            if (this.player.facing == 'right') {
                if (this.player.x + 144 < box.x) {
                    box.body.setAllowGravity(false);
                    box.x -= 6
                    this.time.delayedCall(15, () => {
                        this.attrackHook(hook, box)
                    });
                    //this.jump(poids,blocCible)
                }
                else {
                    box.body.setAllowGravity(true);
                    this.attrack = false;
                    this.player.boxCatched = false;
                }
            }
            else if (this.player.facing == 'left') {
                if (this.player.x - 16 > box.x) {
                    box.body.setAllowGravity(false);
                    box.x += 6
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

    // METHODES POUR PLAYER = HOG ---------------

    // si collision pendant charge, détruit l'objet et stop la charge
    destroyIfCharge(player, breaks) {
        if (player.isCharging && (player.body.touching.left || player.body.touching.right)) {
            breaks.destroy(breaks.x, breaks.y);
            player.stopCharge()
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

    // METHODES POUR PLAYER = RAVEN ------

    // crée une plateforme si on tire sur un élément de décor
    createPlat(proj, ravenPlatOff) {

        const newRavenPlat = this.physics.add.staticSprite(ravenPlatOff.x, ravenPlatOff.y - 16, "ravenPlatOn").setSize(128, 64).setOffset(8, 24);
        this.physics.add.collider(this.player, newRavenPlat);
        this.physics.add.collider(this.projectilesMob, newRavenPlat, this.cleanProj, null, this);
        this.physics.add.collider(this.projectilesPlayer, newRavenPlat, this.cleanProj, null, this);

        ravenPlatOff.destroy(ravenPlatOff.x, ravenPlatOff.y);
        proj.destroy();
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
    }

    startNextLevel(player, detectionZone) {

        if (!this.reachNewLevel) {

            this.cameras.main
                .fadeOut(1500, 0, 0, 25) // fondu au noir

            this.player.inputsMoveLocked = true;
            this.reachNewLevel = true;
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
                    this.scene.start("Level_03", {
                        mapName: "map_03", // nom de la map
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
            });

        }



    }
}

export default SceneClass;