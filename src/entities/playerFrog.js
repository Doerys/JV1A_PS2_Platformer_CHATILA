import Player from "./player.js";

class PlayerFrog extends Player {
    constructor(scene, x, y, facing, currentMob) {
        super(scene, x, y, 'player');

        this.facing = facing;
        this.currentMob = currentMob;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        super.init();

        console.log("PLAYER = FROG");
        //this.jumpCounter = 1; // le nombre de sauts restants (utile pour double jump)
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.currentlyPossess) {

            console.log(this.jumpCounter);

            this.basicMovements();

            if (this.onGround && !this.newJump) {
                this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
                this.inputsMoveLocked = false;
    
                this.jumpCounter = 1; // si le joueur est au sol, réinitialise son compteur de jump
                this.isJumping = false;
                this.canPlane = false;
            }

            // SAUT (plus on appuie, plus on saut haut)

            // déclencheur du saut
            if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && this.onGround) { // si on vient de presser saut + peut sauter true + au sol
                this.jumpPlayer();
            }

            else if ((this.cursors.up.isUp && this.keyZ.isUp) && this.canHighJump) {
                this.canHighJump = false; // évite de pouvoir spammer plutôt que de rester appuyer pour monter plus haut
            }

            // SAUT PLUS HAUT - allonge la hauteur du saut en fonction du timer
            else if ((this.cursors.up.isDown || this.keyZ.isDown) && this.canHighJump) { // si le curseur haut est pressé et jump timer =/= 0
                if (this.jumpTimer.getElapsedSeconds() > .3 || this.body.blocked.up) { // Si le timer du jump est supérieur à 12, le stoppe.
                    this.canHighJump = false;
                    setTimeout(() => {
                        this.canPlane = true;
                    }, 300);
                }
                else {
                    // jump higher if holding jump 
                    this.setVelocityY(-this.speedMoveY);
                }
            }

            // WALL JUMP

            // déclencheur du saut sans être en l'air
            else if (!this.onGround) {

                // WALL JUMP depuis mur GAUCHE
                if ((this.upOnce || this.ZOnce || this.cursors.right.isDown) && this.grabLeft) {

                    console.log("check wall jump gauche")

                    this.jumpPlayer();

                    this.facing = "right";

                    this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                    this.grabLeft = false; // désactive la variable du wallGrab

                    this.setVelocityX(this.speedXMax); // repousse sur la gauche

                    /*setTimeout(() => {
                        if(!this.grabLeft || !this.grabRight){
                        this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                        }
                    }, 2500);*/
                }

                // WALL JUMP depuis mur DROIT
                if ((this.upOnce || this.ZOnce || this.cursors.left.isDown) && this.grabRight) {

                    console.log("check wall jump droit")

                    this.jumpPlayer();

                    this.facing = "left";

                    this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                    this.grabRight = false; // désactive la variable du wallGrab

                    this.setVelocityX(- this.speedXMax); // repousse sur la gauche

                    /*setTimeout(() => {
                        if(!this.grabLeft || !this.grabRight){
                        this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                        }
                    }, 2500);*/
                }
            }

            // WALL GRAB - on se fixe au mur une fois en contact avec lui

            // WALL GRAB GAUCHE
            if (this.blockedLeft && !this.onGround) { // si on est bloqué sur une paroi de gauche, et pas en contact avec le sol

                if (!this.newJump) { // si le saut actuel n'est pas nouveau

                    console.log("check wall grab gauche")

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);
                    this.setVelocityY(0);
                    this.setVelocityX(-3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabLeft = true;
                }
            }

            // WALL GRAB DROIT
            else if (this.blockedRight && !this.onGround) { // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

                if (!this.newJump) { // si le saut actuel n'est pas nouveau

                    console.log("check wall grab droit")

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);
                    this.setVelocityY(0);
                    this.setVelocityX(3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabRight = true;
                }
            }

            // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
            if ((this.grabLeft || this.grabRight) && this.cursors.down.isDown) {

                this.body.setAllowGravity(true);
                this.setVelocityY(150);
                this.inputsMoveLocked = false;
            }

            // GRAPPIN
            if (this.keyE.isDown) {
                this.body.setAllowGravity(false);
                this.setVelocity(0, 0);

                this.inputsMoveLocked = true;

                //this.bout

                setTimeout(() => {
                    this.inputsMoveLocked = false;
                    this.body.setAllowGravity(true);
                }, 100); // après un certain temps, on repasse la possibilité de sauter à true
            }
        }
    }
}

export default PlayerFrog