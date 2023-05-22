import Player from "./player.js";

class PlayerHog extends Player {
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
        
        console.log("PLAYER = HOG");
        this.jumpCounter = 1; // le nombre de sauts restants (utile pour double jump)
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.currentlyPossess) {

            //console.log(this.jumpCounter)

            if (this.onGround && !this.isCharging && !this.isJumping) {

                this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
                this.inputsMoveLocked = false;
    
                this.jumpCounter = 1; // si le joueur est au sol, réinitialise son compteur de jump
                this.isJumping = false;
                this.canPlane = false;
            }

            this.basicMovements();

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

            // trigger de la charge
            if (!this.isCharging && Phaser.Input.Keyboard.JustDown(this.keyShift) && !this.isJumping) {
                this.isCharging = true;
            }

            // charge
            if (this.isCharging) {
                this.inputsMoveLocked = true;

                if (this.facing == 'right') {
                    this.setVelocityX(this.speedMoveX) // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

                    if (this.speedMoveX > this.speedXMax * 3) {
                        this.speedMoveX += this.accelerationX;
                    }
                    else {
                        this.speedMoveX = this.speedXMax * 3; // sinon, vitesse = vitesse max
                    }
                }

                else if (this.facing == "left") {
                    this.setVelocityX(this.speedMoveX)

                    if (this.speedMoveX > this.speedXMax * 3) {
                        this.speedMoveX = -this.accelerationX;
                    }
                    else {
                        this.speedMoveX = -this.speedXMax * 3; // sinon, vitesse = vitesse max
                    }
                }

                if (this.blockedLeft || this.blockedRight) {
                    this.stopCharge();
                }
            }
        }
    }

    stopCharge() {
        this.inputsMoveLocked = false;
        this.setVelocityX(0);
        this.isCharging = false;
    }
}

export default PlayerHog