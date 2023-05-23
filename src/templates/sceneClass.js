import PlayerFrog from "../entities/playerFrog.js";
import PlayerHog from "../entities/playerHog.js";
import PlayerRaven from "../entities/playerRaven.js";

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

    loadMap(levelMap) {

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        // PLAYER - Collision entre le joueur et les limites du niveau

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728).setSize(3072, 1728); //format 16/9 

        // on prend le tileset dans le TILED
        const tileset = levelMap.addTilesetImage(this.mapTileset, this.mapTilesetImage);

        // on crée le calque plateformes
        const layer_platforms = levelMap.createLayer("layer_platforms", tileset);
        const layer_limits = levelMap.createLayer("layer_limits", tileset).setVisible(true);
        const layer_spawn = levelMap.getObjectLayer("Spawn");
        const layer_break = levelMap.getObjectLayer("Break");
        const layer_box = levelMap.getObjectLayer("Box");
        const layer_ravenPlat = levelMap.getObjectLayer("RavenPlatform");
        const layer_stake = levelMap.getObjectLayer("Stake");

        // ajout de collision sur plateformes
        layer_platforms.setCollisionByProperty({ estSolide: true });
        layer_limits.setCollisionByProperty({ estSolide: true });

        // On enregistre le spawn dans une variable
        const spawnPoint = layer_spawn.objects[0];
        this.spawn = layer_spawn.objects[0];

        // éléments de décors
        const breaks = this.physics.add.staticGroup();
        const boxes = this.physics.add.group();
        const ravenPlats = this.physics.add.staticGroup();
        const stakes = this.physics.add.staticGroup();

        // création des éléments destructibles (charge)
        layer_break.objects.forEach(break_create => {
            breaks.create(break_create.x + 32, break_create.y + 32, "break");
        }, this)

        // création des box poussables
        layer_box.objects.forEach(box => {
            boxes.create(box.x + 32, box.y + 32, "box").setDamping(true).setImmovable(true);
            this.physics.add.collider(boxes, layer_platforms, this.slowBox, null, this);
        }, this)

        // création des plateformes qu'on peut créer en tirant dessus
        layer_ravenPlat.objects.forEach(ravenPlat => {
            ravenPlats.create(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOff");
        }, this)

        // création des poteaux sur lesquels on peut se grappiner
        layer_stake.objects.forEach(stake => {
            stakes.create(stake.x + 32, stake.y + 32, "stake");
        }, this)

        return { spawnPoint, layer_platforms, layer_limits, breaks, boxes, ravenPlats, stakes, tileset }
    }

    createPlayer(x, y, layers, currentFacing, currentMob) {

        if (currentMob == "frog") {
            this.player = new PlayerFrog(this, x, y, currentFacing, currentMob).setCollideWorldBounds();
        }
        else if (currentMob == "hog") {
            this.player = new PlayerHog(this, x, y, currentFacing, currentMob).setCollideWorldBounds();
        }
        else if (currentMob == "raven") {
            this.player = new PlayerRaven(this, x, y, currentFacing, currentMob).setCollideWorldBounds();
        }

        //COLLISIONS

        this.physics.add.collider(this.player, layers.layer_platforms); // player > plateformes

        this.physics.add.collider(this.player, this.movingPlat);

        // collisions obstacles brisables
        this.physics.add.collider(this.player, layers.breaks, this.destroyIfCharge, null, this);

        // collision boxes
        this.physics.add.collider(this.player, layers.boxes, this.pushBox, null, this);

        this.physics.add.collider(this.player, this.boxTest, this.pushBox, null, this);

        // collision avec les plateformes raven une fois créées
        this.physics.add.collider(this.player, layers.ravenPlatOn);

        // collision entre projectiles et plateformes Off, pour créer plateformes
        this.physics.add.collider(this.player.projectiles, layers.ravenPlats, this.createPlat, null, this);

        if (currentMob == "frog") {
            // collision hook et stake = grappin
            this.physics.add.overlap(this.player.hook, layers.stakes, this.goToHook, null, this);
            this.physics.add.overlap(this.player.hook, layers.boxes, this.attrackHook, null, this);
            this.physics.add.collider(this.player.hook, layers.layer_platforms);
        }
    }

    // création du mob
    createMob(nameMob, x, y, layers, currentFacing, currentMob) {

        if (currentMob == "frog") {
            nameMob = new MobFrog(this, x, y, currentFacing, currentMob);
        }
        else if (currentMob == "hog") {
            nameMob = new MobHog(this, x, y, currentFacing, currentMob);
        }
        else if (currentMob == "raven") {
            nameMob = new MobRaven(this, x, y, currentFacing, currentMob);
        }

        nameMob
            .setInteractive({ useHandCursor: true }) // on peut cliquer dessus
            .on('pointerdown', function () {

                nameMob.disableIA(); // désactive le update du mob pour éviter un crash

                if (this.activePossession == true) { // si on contrôlait déjà un mob, on remplace notre ancien corps "player" par un mob 
                    this.replacePlayer(this.player, this.player.x, this.player.y, layers, this.possessedMob.sprite, currentFacing, this.possessedMob.nature);
                }
                // possession du mob
                this.possessedMob = this.possessMob(nameMob, nameMob.x, nameMob.y, layers, currentFacing, currentMob);
            }, this)

        // collisions obstacles brisables
        this.physics.add.collider(nameMob, layers.breaks, this.destroyIfCharge, null, this);

        // collision boxes
        //this.physics.add.collider(nameMob, layers.boxes);

        this.physics.add.collider(nameMob, layers.layer_platforms);
        this.physics.add.collider(nameMob, layers.layer_limits);
    }

    // METHODES POUR POSSESSION DE MOBS --------------

    // METHODE POSSEDER MOB - On détruit le mob, et on crée un player à la place
    possessMob(mob, mobX, mobY, layers, currentFacing, currentMob) {
        const sprite = mob; // permet de sauvegarder toutes les infos liées au mob, pour le recréer plus tard
        const nature = currentMob; // permet de sauvegarder quel type de mob recréer plus tard
        mob.destroy();
        this.createPlayer(mobX, mobY, layers, currentFacing, currentMob);
        this.activePossession = true;

        return { sprite, nature }
    }

    // METHODE POSSEDER AUTRE MOB - On détruit le player, et on crée un mob à la place (en utilisant le mob sauvegardé préalablement dans le possessMob)
    replacePlayer(player, playerX, playerY, layers, possessedMob, currentFacing, nature) {
        player.disablePlayer();
        player.destroy();
        this.createMob(possessedMob, playerX, playerY, layers, currentFacing, nature);
    }

    // METHODES POUR PLAYER = FROG ----

    checkDistance(x1, x2) { // mesure la distance entre deux éléments
        let distance = Math.abs(x2 - x1);
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
                if (this.player.x + 32 < box.x) {
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

    manageOnBox(player, box) {
    }

    // si collision pendant charge, détruit l'objet et stop la charge
    destroyIfCharge(player, breaks) {
        if (player.isCharging && (player.body.touching.left || player.body.touching.right)) {
            breaks.destroy(breaks.x, breaks.y);
            this.player.stopCharge()
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
}
export default SceneClass;