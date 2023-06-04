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

        if (!this.hookCreated) {
            this.hook = new Hook(this.scene, this.x + 64, this.y + 64, "hook")
                .setCollideWorldBounds(true)
                .setOrigin(0.5, 0.5)
                .disableBody(true, true);

            this.hook.body.setAllowGravity(false);

            //

            this.rope = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
                .setOrigin(0, 0.5)
                .setDepth(-1)
                .disableBody(true, true);

            this.rope.body.setAllowGravity(false);

            //

            this.rope2 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
                .setOrigin(0, 0.5)
                .setDepth(-1)
                .disableBody(true, true);

            this.rope2.body.setAllowGravity(false);

            //

            this.rope3 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
                .setOrigin(0, 0.5)
                .setDepth(-1)
                .disableBody(true, true);

            this.rope3.body.setAllowGravity(false);

            //

            this.rope4 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
                .setOrigin(0, 0.5)
                .setDepth(-1)
                .disableBody(true, true);

            this.rope4.body.setAllowGravity(false);

            //

            this.rope5 = new Rope(this.scene, this.x + 64, this.y + 64, 'rope')
                .setOrigin(0, 0.5)
                .setDepth(-1)
                .disableBody(true, true);

            this.rope5.body.setAllowGravity(false);

            this.hookCreated = true;
        }
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.isPossessed) {

            //console.log(this.body.velocity.y)

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
            if (this.blockedLeft && (this.cursors.left.isDown || this.keyQ.isDown) && !this.onGround) { // si on est bloqué sur une paroi de gauche, et pas en contact avec le sol

                if (!this.newJump /*|| this.body.velocity.y > 300*/) { // si le saut actuel n'est pas nouveau

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);
                    this.setVelocityY(0);
                    this.setVelocityX(-3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabLeft = true;
                    this.wasGrabingLeft = true;
                    this.isGrabing = true;
                }
            }

            // WALL GRAB DROIT
            else if (this.blockedRight && (this.cursors.right.isDown || this.keyD.isDown) && !this.onGround) { // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

                if (!this.newJump /*|| this.body.velocity.y > 300*/) { // si le saut actuel n'est pas nouveau

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);
                    this.setVelocityY(0);
                    this.setVelocityX(3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabRight = true;                    
                    this.wasGrabingRight = true;
                    this.isGrabing = true;
                }
            }

            else if (!this.blockedLeft && !this.blockedRight && !this.onGround) {
                this.grabRight = false;
                this.grabLeft = false;
                this.isGrabing = false;
            }

            // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
            if ((this.grabLeft || this.grabRight) && (this.cursors.down.isDown || this.keyS.isDown)) {

                this.body.setAllowGravity(true);
                this.setVelocityY(200);
                this.inputsMoveLocked = false;
            }

            const distanceHook = this.scene.checkDistance(this.x + 64, this.hook.x);

            // GRAPPIN
            if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.isHooking && this.canHook) {

                this.canHook = false;

                // fixe le joueur sur place
                this.inputsMoveLocked = true; // commandes bloquées
                this.body.setAllowGravity(false); //gravité annulée 
                this.setVelocity(0, 0); // vélocité annulée
                this.speedMoveX = 0;

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

            // débloque les commandes après l'utilisation du grappin
            if (!this.isHooking && !this.grabLeft && !this.grabRight && this.canHook) {
                if (!this.isWallJumping) {
                    this.inputsMoveLocked = false; // commandes débloquées
                }
                this.body.setAllowGravity(true); //gravité rétablie
            }

            if (this.hookCreated) {

                if (this.isHooking) {

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
                }
            }

            // si le grappin atteint la distance max OU choppe une caisse ou EST IMMOBILE : renvoie le grappin
            if ((distanceHook >= this.maxHookDistance) || (this.boxCatched) || (this.hook.body.velocity.x == 0 && !this.stakeCatched && !this.boxCatched && !this.returnHook && this.isHooking) || (this.scene.hookCollideMovingPlat)) {

                if (this.facing == "right" && distanceHook != 0 && (this.hook.x != this.x + 64)) {
                    this.hook.setVelocityX(-this.speedHook);
                }

                else if (this.facing == "left" && distanceHook != 0 && (this.hook.x != this.x + 64)) {
                    this.hook.setVelocityX(this.speedHook);
                }

                this.returnHook = true;
            }

            // si le grappin atteint un poteau
            if (this.stakeCatched) {

                this.hook.setVelocity(0);

                this.returnHook = true;
            }

            // stoppe le grapin lors du retour et le fait disparaître
            if (this.returnHook) {
                if (distanceHook <= 15) {
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
    }
}

export default PlayerFrog