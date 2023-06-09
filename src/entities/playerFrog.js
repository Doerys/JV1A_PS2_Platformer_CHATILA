import Player from "./player.js";
import Hook from "./hook.js";
import Rope from "./rope.js";

class PlayerFrog extends Player {
    constructor(scene, x, y, facing, currentMob, haveCure) {
        super(scene, x, y, 'frogImage');

        this.facing = facing;
        this.currentMob = currentMob;
        this.haveCure = haveCure;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        super.init();

        this.jumpCounter = 1; // le nombre de sauts restants (utile pour double jump)

        //console.log("PLAYER = FROG");

        //this.physics.add.collider(this.hook, layersmurs);

        this.hook = new Hook(this.scene, this.x + 64, this.y + 64, "hook")
            .setAlpha()
            .setCollideWorldBounds(true)
            .setOrigin(0.5, 0.5)
            .disableBody(true, true);

        this.hook.body.setAllowGravity(false);

        //

        this.rope = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
            .setAlpha(0.8)
            .setOrigin(0, 0.5)
            .setDepth(-1)
            .disableBody(true, true);

        this.rope.body.setAllowGravity(false);

        //

        this.rope2 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
            .setAlpha(0.8)
            .setOrigin(0, 0.5)
            .setDepth(-1)
            .disableBody(true, true);

        this.rope2.body.setAllowGravity(false);

        //

        this.rope3 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
            .setAlpha(0.8)
            .setOrigin(0, 0.5)
            .setDepth(-1)
            .disableBody(true, true);

        this.rope3.body.setAllowGravity(false);

        //

        this.rope4 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
            .setAlpha(0.8)
            .setOrigin(0, 0.5)
            .setDepth(-1)
            .disableBody(true, true);

        this.rope4.body.setAllowGravity(false);

        //

        this.rope5 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
            .setAlpha(0.8)
            .setOrigin(0, 0.5)
            .setDepth(-1)
            .disableBody(true, true);

        this.rope5.body.setAllowGravity(false);
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.isPossessed) {

            //console.log(this.grabRight);

            // gestion des animations
            this.animManager();

            // METHODE POUR MECANIQUES COMMUNES
            this.handlePlayer();

            // débloque la capacité de se mouvoir en chute libre
            if (this.body.velocity.y > 300) {
                this.inputsMoveLocked = false;
            }

            // WALL GRAB - on se fixe au mur une fois en contact avec lui

            // WALL GRAB GAUCHE
            if (this.blockedLeft && !this.onGround && this.automaticGrab) { // si on est bloqué sur une paroi de gauche, et pas en contact avec le sol

                if (!this.newJump) { // si le saut actuel n'est pas nouveau

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);

                    if (!this.grabCollapse) {
                        this.setVelocityY(0);
                    }

                    this.setVelocityX(-3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabLeft = true;
                    this.wasGrabingLeft = true;
                    this.isGrabing = true;
                }
            }

            // WALL GRAB DROIT
            else if (this.blockedRight && !this.onGround && this.automaticGrab) { // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

                if (!this.newJump) { // si le saut actuel n'est pas nouveau

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);

                    if (!this.grabCollapse) {
                        this.setVelocityY(0);
                    }

                    this.setVelocityX(3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabRight = true;
                    this.wasGrabingRight = true;
                    this.isGrabing = true;
                }
            }

            // DECROCHAGE DU MUR

            // première vérif pour lancer les setTimeout => si on est accroché à une surface et qu'on ne touche pas la touche pour rester accrocher
            if (this.isGrabing && !this.startGrabFall && ((this.grabRight && this.cursors.right.isUp && this.keyD.isUp) || (this.grabLeft && this.cursors.left.isUp && this.keyQ.isUp))) {

                this.startGrabFall = true;

                // Début de slide le long du mur, pour prévenir le joueur de la chute à venir
                setTimeout(() => {

                    // Double vérification pour ne pas déclencher l'événement si entre temps, le joueur a grab

                    if ((this.grabRight && this.cursors.right.isUp && this.keyD.isUp) || (this.grabLeft && this.cursors.left.isUp && this.keyQ.isUp)) {

                        this.setVelocityY(50);
                        this.grabCollapse = true;
                    }

                }, 100);

                // Chute
                setTimeout(() => {

                    // Double vérification pour ne pas déclencher l'événement si entre temps, le joueur a grab
                    if ((this.grabRight && this.cursors.right.isUp && this.keyD.isUp) || (this.grabLeft && this.cursors.left.isUp && this.keyQ.isUp)) {

                        this.automaticGrab = false;
                        this.grabCollapse = false;
                    }

                }, 500);
            }

            // si input de grab pressé pendant un début de décrochage, on stope le début de slide
            if (this.grabCollapse) {

                if ((this.grabLeft && (this.cursors.left.isDown || this.keyQ.isDown)) || (this.grabRight && (this.cursors.right.isDown || this.keyD.isDown))) {
                    this.grabCollapse = false;
                    this.startGrabFall = false;
                }
            }

            // si on a lâché le grab, réinitialisation des variables
            if (!this.blockedLeft && !this.blockedRight && !this.onGround && !this.grabCollapse) {
                this.grabRight = false;
                this.grabLeft = false;
                this.isGrabing = false;

                this.automaticGrab = true;
                this.grabCollapse = false;
                this.startGrabFall = false;
                
                if (this.scene.verticalWallBreaking) {
                    this.scene.verticalWallBreaking = false;
                    this.scene.weakPlatVerticalCollider = this.scene.physics.add.collider(this, this.scene.layers.weakPlatsVertical, this.destroyVerticalPlat, null, this);
                }
            }

            // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
            if ((this.grabLeft || this.grabRight) && (this.cursors.down.isDown || this.keyS.isDown)) {

                this.body.setAllowGravity(true);
                this.setVelocityY(200);
                this.inputsMoveLocked = false;
            }

            // GRAPPIN
            if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.isHooking && this.canHook && !this.grabLeft && !this.grabRight) {

                this.canHook = false;

                this.reachStake = false;

                // fixe le joueur sur place
                this.inputsMoveLocked = true; // commandes bloquées
                this.body.setAllowGravity(false); //gravité annulée 
                this.setVelocity(0, 0); // vélocité annulée
                this.speedMoveX = 0;

                // crée la langue
                setTimeout(() => {

                    this.hook.enableBody(true, this.x + 64, this.y + 54, true, true)

                    //PROJECTION HOOK (en fonction de l'orientation du perso, projette le grappin à droite ou à gauche)

                    if (this.facing == "right") {
                        this.hook.flipX = false;
                        this.rope.flipX = false;
                        this.rope.enableBody(true, this.x + 64, this.y + 64, true, true);
                        this.hook.setVelocityX(this.speedHook);
                    }

                    else if (this.facing == "left") {
                        this.hook.flipX = true;
                        this.rope.flipX = true;
                        this.rope.enableBody(true, this.x, this.y + 64, true, true);
                        this.hook.setVelocityX(-this.speedHook);
                    }

                    this.isHooking = true;
                }, 100);


                // réinitialise les variables et les mouvements du personnage
                setTimeout(() => {
                    this.canHook = true;
                    //this.isHooking = false; // n'est plus en train de grappiner
                    //this.inputsMoveLocked = false; // commandes débloquées
                    //this.body.setAllowGravity(true); //gravité rétablie 
                }, 200); // après un certain temps, on repasse la possibilité de sauter à true
            }

            if (this.isHooking) {
                const distanceHook = this.scene.checkDistance(this.x + 64, this.hook.x);

                // si le grappin atteint la distance max OU choppe une caisse OU est immobile sans toucher d'élément interactif OU touche une plat mobile : renvoie le grappin
                if ((distanceHook >= this.maxHookDistance) || (this.boxCatched) || (this.hook.body.velocity.x == 0 && !this.stakeCatched && !this.boxCatched && !this.returnHook && this.isHooking) || (this.scene.hookCollideMovingPlat)) {

                    if (this.facing == "right" && distanceHook != 0 && (this.hook.x != this.x + 64)) {
                        this.hook.setVelocityX(-this.speedHook);
                    }

                    else if (this.facing == "left" && distanceHook != 0 && (this.hook.x != this.x + 64)) {
                        this.hook.setVelocityX(this.speedHook);
                    }

                    this.returnHook = true;
                }

                // crée des longueurs de langue à l'aller
                if (!this.returnHook) {
                    if (this.facing == "left") {

                        if (distanceHook >= 120) {
                            this.rope2.enableBody(true, this.x - 50, this.y + 64, true, true)
                        }

                        if (distanceHook >= 160) {
                            this.rope3.enableBody(true, this.x - 96, this.y + 64, true, true)
                        }

                        if (distanceHook >= 200) {
                            this.rope4.enableBody(true, this.x - 146, this.y + 64, true, true)
                        }

                        if (distanceHook >= 240) {
                            this.rope5.enableBody(true, this.x - 190, this.y + 64, true, true)
                        }

                    }

                    if (this.facing == "right") {

                        if (distanceHook >= 120) {
                            this.rope2.enableBody(true, this.x + 115, this.y + 64, true, true)
                        }

                        if (distanceHook >= 160) {
                            this.rope3.enableBody(true, this.x + 166, this.y + 64, true, true)
                        }

                        if (distanceHook >= 200) {
                            this.rope4.enableBody(true, this.x + 216, this.y + 64, true, true)
                        }

                        if (distanceHook >= 240) {
                            this.rope5.enableBody(true, this.x + 260, this.y + 64, true, true)
                        }
                    }
                }

                // enlève les longueurs de langue au retour
                if (this.returnHook) {

                    if (!this.stakeCatched) {
                        if (distanceHook < 80) {
                            this.rope.disableBody(true, true);
                        }

                        if (distanceHook < 120) {
                            this.rope2.disableBody(true, true);
                        }

                        if (distanceHook < 160) {
                            this.rope3.disableBody(true, true);
                        }

                        if (distanceHook < 200) {
                            this.rope4.disableBody(true, true);
                        }

                        if (distanceHook < 240) {
                            this.rope5.disableBody(true, true);
                        }
                    }

                    if (this.stakeCatched) {

                        // enlève les longueurs de langue au retour
                        if (distanceHook < 240) {
                            this.rope.disableBody(true, true);
                        }

                        if (distanceHook < 200) {
                            this.rope2.disableBody(true, true);
                        }

                        if (distanceHook < 160) {
                            this.rope3.disableBody(true, true);
                        }

                        if (distanceHook < 120) {
                            this.rope4.disableBody(true, true);
                        }

                        if (distanceHook < 80) {
                            this.rope5.disableBody(true, true);
                        }
                    }
                }

                // si le grappin atteint un poteau
                if (this.stakeCatched) {

                    this.hook.setVelocity(0);
                    this.returnHook = true;
                }

                // stoppe le grapin lors du retour et le fait disparaître
                if (this.returnHook) {
                    if (distanceHook <= 15 || this.reachStake) {

                        this.hook.setVelocityX(0);

                        this.hook.disableBody(true, true);
                        this.rope.disableBody(true, true);
                        this.rope2.disableBody(true, true);
                        this.rope3.disableBody(true, true);
                        this.rope4.disableBody(true, true);
                        this.rope5.disableBody(true, true);

                        this.returnHook = false;
                        this.isHooking = false;
                    }
                }
            }

            // débloque les commandes après l'utilisation du grappin
            if (!this.isHooking && !this.grabLeft && !this.grabRight && this.canHook) {
                if (!this.isWallJumping) {
                    this.inputsMoveLocked = false; // commandes débloquées
                }
                this.body.setAllowGravity(true); //gravité rétablie
            }

        }
    }
}

export default PlayerFrog