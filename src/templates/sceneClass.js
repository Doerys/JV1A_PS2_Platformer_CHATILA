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
                    //gravity: { y: 1450 },
                    gravity: { y: 1600 },
                    debug: true,
                    tileBias: 64,
                }
            },

            input: { gamepad: true },

            fps: {
                target: 60,
            },
        })
    }

    Init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
    }

    loadVar(layers) {
        this.controller = false;

        this.playerKilled = false;
        this.hasSaveMob = false;

        this.buttonOn = false;

        this.projectilesMob = new Phaser.GameObjects.Group;

        this.projectilesPlayer = new Phaser.GameObjects.Group;

        this.playerGroup = this.physics.add.group();
        this.mobGroup = this.physics.add.group();

        this.door = this.physics.add.staticSprite(layers.spawnDoor.x + 32, layers.spawnDoor.y + 92, "door");

        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });
    }

    // load des CALQUES / OBJETS / SPAWNS MOBS dans une constante liée à chaque niveau 
    loadMap(levelMap) {

        this.physics.world.setBounds(0, 0, 3072, 1920);

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728).setSize(3072, 1728).setOrigin(0, 0); //format 16/9 

        // ARRIERE PLAN - BACKGROUND
        this.background = this.add.tileSprite(0, 0, 3072, 1728, "background").setOrigin(0, 0).setDepth(-3);

        //Enlever commentaire pour voir la deadZone
        //this.cameras.main.setBounds(0, 192, 3072, 1920).setSize(3072, 1920).setOrigin(0, 0); 

        // on prend le tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // Calques layers
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset).setDepth(1);
        const layer_decos1 = levelMap.createLayer("layer_decos1", tileset).setDepth(2);
        const layer_decos2 = levelMap.createLayer("layer_decos2", tileset).setDepth(3);
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

        // ajout de collision sur plateformes
        layer_platforms.setCollisionByProperty({ estSolide: true });
        layer_limits.setCollisionByProperty({ estSolide: true });
        layer_deadZone.setCollisionByProperty({ estSolide: true });

        // spawns de chaque mob
        const spawnFrog = layer_spawnFrog.objects[0];
        this.spawnFrog = layer_spawnFrog.objects[0];

        const spawnHog = layer_spawnHog.objects[0];
        this.spawnHog = layer_spawnHog.objects[0];

        const spawnRaven = layer_spawnRaven.objects[0];
        this.spawnRaven = layer_spawnRaven.objects[0];

        const spawnCure = layer_cure.objects[0];
        this.spawnCure = layer_cure.objects[0];

        const spawnDoor = layer_door.objects[0];
        //this.spawnDoor = layer_door.objects[0];

        const buttons = this.physics.add.staticGroup();
        const buttonBases = this.physics.add.staticGroup();
        //const doors = this.physics.add.staticGroup();

        // éléments de décors
        const boxes = this.physics.add.group({
            immovable: true,
            damping: true
        });

        const bigBoxes = this.physics.add.group({
            immovable: true,
            damping: true
        });

        const stakes = this.physics.add.group();

        const breaks = this.physics.add.staticGroup();
        const pics = this.physics.add.staticGroup();

        const cures = this.physics.add.staticGroup();

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

        // création des box poussables
        layer_box.objects.forEach(box => {
            //boxes.create(box.x + 32, box.y, "box").setDamping(true).setImmovable(true);
            const box_create = this.physics.add.sprite(box.x + 32, box.y, "box").setDamping(true).setImmovable(true);

            this.physics.add.collider(box_create, this.movingPlat1);
            this.physics.add.collider(box_create, this.movingPlat2);
            this.physics.add.collider(box_create, this.movingPlat3);
            this.physics.add.collider(box_create, this.movingPlat4);

            boxes.add(box_create);

            box_create.setCollideWorldBounds(true);

            this.physics.add.collider(boxes, layer_platforms, this.slowBox, null, this);

        }, this)

        layer_bigBox.objects.forEach(bigBox => {

            const box_create = this.physics.add.sprite(bigBox.x + 32, bigBox.y, "bigBox").setDamping(true).setImmovable(true);

            this.physics.add.collider(box_create, this.movingPlat1);
            this.physics.add.collider(box_create, this.movingPlat2);
            this.physics.add.collider(box_create, this.movingPlat3);
            this.physics.add.collider(box_create, this.movingPlat4);

            bigBoxes.add(box_create);

            box_create.setCollideWorldBounds(true);

            this.physics.add.collider(bigBoxes, layer_platforms, this.slowBox, null, this);
        }, this)

        // création des poteaux sur lesquels on peut se grappiner
        layer_stake.objects.forEach(stake => {
            //stakes.create(stake.x + 32, stake.y, "stake");
            const stake_create = this.physics.add.sprite(stake.x + 32, stake.y, "stake");

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
            breaks.create(break_create.x + 64, break_create.y + 128, "break").setSize(128, 256);
        }, this)

        layer_pics.objects.forEach(pic => {
            pics.create(pic.x + 32, pic.y - 32, "pic").setSize(48, 64);
        })

        layer_cure.objects.forEach(cure => {
            cures.create(cure.x + 32, cure.y, "cure").setDepth(-1);
        })

        layer_buttonBase.objects.forEach(buttonBase => {
            buttonBases.create(buttonBase.x + 64, buttonBase.y - 8, "buttonBase");
        })

        layer_button.objects.forEach(button => {
            buttons.create(button.x + 64, button.y - 24, "button");
        })

        /*layer_door.objects.forEach(door => {
            doors.create(door.x + 32, door.y + 92, "door");
        })*/

        // création des plateformes qu'on peut créer en tirant dessus
        layer_ravenPlat.objects.forEach(ravenPlat => {
            ravenPlats.create(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOff");
        }, this)

        layer_weakPlat.objects.forEach(plat => {
            weakPlats.create(plat.x + 96, plat.y + 32, "weakPlat").setSize(192, 64);
        })

        layer_weakPlatVertical.objects.forEach(plat => {
            weakPlatsVertical.create(plat.x + 32, plat.y + 96, "weakPlatVertical").setSize(64, 192);
        })

        return { spawnFrog, spawnHog, spawnRaven, layer_platforms, layer_limits, layer_deadZone, boxes, bigBoxes, stakes, cures, spawnCure, breaks, pics, ravenPlats, /*movingPlats,*/ weakPlats, weakPlatsVertical, layer_movingPlats, buttonBases, buttons, spawnDoor, tileset }
    }

    // création du mob -> Appelée au chargement de chaque scène, et quand on switch de possession de mob 
    createMob(nameMob, x, y, layers, facing, currentMob, isCorrupted, haveCure) {

        if (currentMob == "frog") {
            nameMob = new MobFrog(this, x, y, facing, currentMob, isCorrupted, haveCure).setSize(52, 64).setOffset(8, 0);
        }
        else if (currentMob == "hog") {
            nameMob = new MobHog(this, x, y, facing, currentMob, isCorrupted, haveCure).setSize(128, 96).setOffset(64, 32);
        }
        else if (currentMob == "raven") {
            nameMob = new MobRaven(this, x, y, facing, currentMob, isCorrupted, haveCure).setSize(64, 96).setOffset(0, 32);
        }

        this.mobGroup.add(nameMob);

        nameMob.setCollideWorldBounds(true);

        if (!isCorrupted) {

            nameMob
                .setInteractive({ useHandCursor: true }) // on peut cliquer dessus
                .on('pointerdown', function () {

                    nameMob.disableIA(); // désactive le update du mob pour éviter un crash

                    if (this.activePossession) { // si on contrôlait déjà un mob, on remplace notre ancien corps "player" par un mob 
                        if (this.hasSaveMob) {
                            this.replaceMobBySaveMob(this.player, layers, this.saveMob);
                        }
                        else if (!this.hasSaveMob) { // si on contrôlait déjà un mob, on remplace notre ancien corps "player" par un mob 
                            this.replaceMobByPlayer(this.player, layers);
                        }
                    }
                    // possession du mob
                    this.possessMob(nameMob, nameMob.x, nameMob.y, this.layers);
                }, this)
        }

        this.physics.add.overlap(nameMob, this.playerGroup, this.checkCharge, null, this);

        this.physics.add.collider(nameMob, layers.layer_platforms);
        this.physics.add.collider(nameMob, layers.layer_limits);
        this.physics.add.collider(nameMob, layers.layer_deadZone, this.kill, null, this);

        // collisions obstacles brisables
        this.physics.add.collider(nameMob, layers.breaks, this.destroyIfCharge, null, this);
        // collision boxes
        this.physics.add.collider(nameMob, layers.boxes);

        this.physics.add.overlap(nameMob, layers.cures, this.isCured, null, this);

        this.physics.add.overlap(nameMob, layers.pics, this.kill, null, this);

        this.physics.add.collider(this.projectilesMob, layers.ravenPlats, this.createPlat, null, this);

        this.physics.add.collider(this.projectilesPlayer, nameMob, this.hitProjectile, null, this);

        this.physics.add.collider(nameMob, layers.buttonBases);

        this.physics.add.collider(nameMob, layers.buttons, this.pressButtons, null, this);

        this.physics.add.collider(nameMob, this.door);
    }


    // création du Player appelée à chaque POSSESSION de mob
    createPlayer(x, y, layers, facing, currentMob, haveCure) {

        if (!this.activePossession) {
            this.player.enableBody();
        }

        if (currentMob == "frog") {
            this.player = new PlayerFrog(this, x, y, facing, currentMob, haveCure).setSize(48, 64);
        }
        else if (currentMob == "hog") {
            this.player = new PlayerHog(this, x, y, facing, currentMob, haveCure).setSize(128, 96).setOffset(64, 32);
        }
        else if (currentMob == "raven") {
            this.player = new PlayerRaven(this, x, y, facing, currentMob, haveCure).setSize(64, 96).setOffset(0, 32);
        }

        this.playerGroup.add(this.player);

        this.player.setCollideWorldBounds(true)

        //COLLISIONS

        this.physics.add.collider(this.player, layers.layer_platforms); // player > plateformes

        this.physics.add.collider(this.player, layers.layer_deadZone, this.kill, null, this);

        //this.physics.add.collider(this.player, layers.movingPlats);
        //this.physics.add.collider(this.player, this.movingPlat);

        this.physics.add.collider(this.player, this.movingPlat1);
        this.physics.add.collider(this.player, this.movingPlat2);
        this.physics.add.collider(this.player, this.movingPlat3);

        // collisions obstacles brisables
        this.physics.add.collider(this.player, layers.breaks, this.destroyIfCharge, null, this);

        // collision boxes
        this.physics.add.collider(this.player, layers.boxes, this.pushBox, null, this);

        // collision avec les plateformes raven une fois créées
        this.physics.add.collider(this.player, layers.ravenPlatOn);

        // collision entre projectiles et plateformes Off, pour créer plateformes
        this.physics.add.collider(this.projectilesPlayer, layers.layer_platforms);
        this.physics.add.collider(this.projectilesPlayer, layers.ravenPlats, this.createPlat, null, this);

        this.physics.add.collider(this.projectilesMob, this.player, this.hitProjectile, null, this);

        this.physics.add.overlap(this.player, layers.cures, this.getCure, null, this);

        if (currentMob == "frog") {
            // collision hook et stake = grappin
            this.physics.add.overlap(this.player.hook, layers.stakes, this.goToHook, null, this);
            this.physics.add.overlap(this.player.hook, layers.boxes, this.attrackHook, null, this);
            this.physics.add.collider(this.player.hook, layers.layer_platforms);
        }

        this.physics.add.collider(this.player, layers.weakPlatsVertical, this.destroyVerticalPlat, null, this);

        this.physics.add.overlap(this.player, this.mobGroup, this.checkCharge, null, this);

        this.physics.add.overlap(this.player, layers.pics, this.kill, null, this);

        this.physics.add.collider(this.player, layers.weakPlats, this.destroyPlat, null, this);

        this.physics.add.collider(this.player, layers.weakPlats, this.destroyPlat, null, this);

        this.physics.add.collider(this.player, layers.buttonBases);

        this.physics.add.collider(this.player, layers.buttons, this.pressButtons, null, this);
    }

    // METHODES POUR POSSESSION DE MOBS --------------

    // METHODE POSSEDER MOB - On détruit le mob, et on crée un player à la place
    possessMob(mob, mobX, mobY, layers) {
        this.saveMob = mob; // permet de sauvegarder toutes les infos liées au mob, pour le recréer plus tard
        //const nature = currentMob; // permet de sauvegarder quel type de mob recréer plus tard
        mob.destroy();
        this.createPlayer(mobX, mobY, layers, mob.facing, mob.currentMob, mob.haveCure);
        this.activePossession = true;
    }

    // METHODE POSSEDER AUTRE MOB - On détruit le player, et on crée un mob à la place (en utilisant le mob sauvegardé préalablement dans le possessMob)
    replaceMobBySaveMob(player, layers, possessedMob) {
        player.disablePlayer();
        player.destroy();
        this.createMob(possessedMob, player.x, player.y, layers, possessedMob.facing, possessedMob.currentMob, possessedMob.isCorrupted, player.haveCure);
    }

    replaceMobByPlayer(player, layers) {
        player.disablePlayer();
        player.destroy();
        this.createMob(this.mob1, player.x, player.y, layers, player.facing, player.currentMob, player.isCorrupted, player.haveCure);
        this.hasSaveMob = true;
    }

    // METHODES POUR BOUTONS ET PORTES

    pressButtons(mob, button) {

        // Verification qu'on est bien SUR le bouton, et pas collé à gauche ou à droite
        if (!mob.body.blocked.left && !mob.body.blocked.right) {

            // SI HOG
            if (mob.currentMob == "hog") {
                if (mob.isPossessed) {
                    // TWEEN
                    /*this.tweens.timeline({
                        targets: button,
                        tweens: [
                            { x: 0, y: +1, duration: 100, ease: 'Stepped' }
                        ]
                    });*/

                    //console.log("check Hog player")

                    mob.isPressingButton = true;
                    //this.buttonOn = true;
                }
                else {
                    // TWEEN

                    console.log("check Hog mob")

                    mob.isPressingButton = true;
                    //this.buttonOn = true;
                }
            }

            // SI RAVEN OU FROG
            else if (mob.isPossessed) {
                console.log("check Frog player")
            }
            else {
                console.log("check Frog mob")
            }
        }
    }

    manageDoor() {

        if (this.physics.collide(this.player, this.layers.buttons)){
            if (!this.player.body.blocked.left && !this.player.body.blocked.right) {

                // SI HOG
                if (this.player.currentMob == "hog") {
                    if (this.player.isPossessed) {
                        // TWEEN
                        /*this.tweens.timeline({
                            targets: button,
                            tweens: [
                                { x: 0, y: +1, duration: 100, ease: 'Stepped' }
                            ]
                        });*/
    
                        //console.log("check Hog player")
    
                        this.player.isPressingButton = true;
                        this.buttonOn = true;

                        console.log("CHECK TRUE")
                    }
                    else {
                        // TWEEN
    
                        console.log("check Hog mob")
    
                        this.player.isPressingButton = true;
                        //this.buttonOn = true;
                    }
                }
    
                // SI RAVEN OU FROG
                else if (this.player.isPossessed) {
                    console.log("check Frog player")
                }
                else {
                    console.log("check Frog mob")
                }
            }
        }
        else if (!this.physics.collide(this.player, this.layers.buttons)) {
            console.log("CHECK FALSE")
            this.buttonOn = false;
        }

        /*if (this.buttonOn) {
            
            this.door.disableBody(true, true);
        }
        else if (this.door.disable == true && !this.buttonOn) {
            this.door.enableBody(true, true);
        }*/
    }

    // METHODES DE MORT ET DE RESPAWN

    kill(victim) {
        victim.destroy();

        if (!victim.isPossessed) {
            victim.disableIA();
        }
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
                    const newCure = this.physics.add.staticSprite(this.layers.spawnCure.x + 32, this.layers.spawnCure.y, "cure").setDepth(-1);
                    this.layers.cures.add(newCure);
                }, 500);
            }
        }

        this.respawnMob(victim);
    }

    respawnMob(target) {

        setTimeout(() => {
            if (target.currentMob == "frog") {
                this.createMob(target, this.layers.spawnFrog.x, this.layers.spawnFrog.y, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
            else if (target.currentMob == "hog") {
                this.createMob(target, this.layers.spawnHog.x, this.layers.spawnHog.y, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
            else if (target.currentMob == "raven") {
                this.createMob(target, this.layers.spawnRaven.x, this.layers.spawnRaven.y, this.layers, target.facing, target.currentMob, target.isCorrupted, false);
            }
        }, 500);
    }

    // METHODES POUR LES PLATEFORMES FRAGILES

    destroyPlat(player, platform) {
        if (player.currentMob == "hog" && player.onGround) {
            platform.disableBody();
            /*setTimeout(() => { 
                platform.destroy();
            }, 50);*/

            setTimeout(() => {
                platform.enableBody();
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

    // METHODES POUR PURIFIER MOB

    getCure(player, cure) {
        if (!this.player.haveCure && Phaser.Input.Keyboard.JustDown(this.player.keyE)) {
            cure.destroy();
            player.haveCure = true;
        }
    }

    dropCure() {
        if (this.player.haveCure && this.player.onGround && Phaser.Input.Keyboard.JustDown(this.player.keyE)) {

            this.player.haveCure = false;

            const newCure = this.physics.add.staticSprite(this.player.x, this.player.y, 'cure').setDepth(-1);

            this.layers.cures.add(newCure);
        }
    }

    isCured(mob, cure) {

        if (mob.isCorrupted) {
            mob.disableIA();
            cure.destroy();
            mob.destroy();
            this.createMob(mob, mob.x, mob.y, this.layers, mob.facing, mob.currentMob, false, mob.haveCure);
        }
    }

    // METHODES POUR PLAYER = FROG ----

    checkDistance(a, b) { // mesure la distance entre deux éléments
        let distance = Math.abs(a - b);
        return distance
    }

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
                if (this.player.x + 64 < box.x) {
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
                if (this.player.x - 64 > box.x) {
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
            this.player.stopCharge()
        }
    }

    checkCharge(hog, target) {
        if (hog.isCharging) {
            this.kill(target);
        }
    }

    pushBox(player, box) {
        if (player.body.blocked.down && !player.blockedLeft && !player.blockedLeft) {
            player.body.velocity.y = 0;
            box.body.setAllowGravity(false);
            box.setImmovable(true);
        }
        if ((player.body.blocked.right || player.body.blocked.left) && player.currentMob == "hog" && !player.isCharging) {
            box.setImmovable(false);
        }
    }

    // immobilise la box quand on ne la pousse pas
    slowBox(box) {
        if (box.body.blocked.down) {
            if (box.body.blocked.right || box.body.blocked.left) {
                //box.body.setImmovable(true);
                box.setVelocity(0, 0);
            }
            box.setDragX(0.0001);
        }
    }

    // METHODES POUR PLAYER = RAVEN ------

    createPlat(proj, ravenPlatOff) {

        const newRavenPlat = this.physics.add.staticSprite(ravenPlatOff.x, ravenPlatOff.y, "ravenPlatOn");
        this.physics.add.collider(this.player, newRavenPlat);

        ravenPlatOff.destroy(ravenPlatOff.x, ravenPlatOff.y);
        proj.destroy();
    }

    hitProjectile(projectile, target) {
        projectile.destroy();
        this.kill(target);
    }

    onProjectileCollision(enemy, projectile) {
        //enemy.getHit(projectile); 
        //projectile.hit(enemy);
        enemy.destroy();
        projectile.destroy();
    }
}
export default SceneClass;