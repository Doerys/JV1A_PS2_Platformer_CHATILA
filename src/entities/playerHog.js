import Player from "./player.js";

class PlayerHog extends Player {
    constructor(scene, x, y, facing, currentMob, haveCure) {
        super(scene, x, y, 'hogImage');

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
        
        //console.log("PLAYER = HOG");
        this.jumpCounter = 1; // le nombre de sauts restants (utile pour double jump)
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.isPossessed) {

            // gestion des animations
            this.animManager();

            // METHODE POUR MECANIQUES COMMUNES
            this.handlePlayer();

            // trigger de la charge
            if (!this.isCharging && Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.isJumping && this.canCharge) {
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

                if (this.body.blocked.left || this.body.blocked.right) {
                    this.stopCharge();
                }
            }
        }
    }

    stopCharge() {
        this.setVelocityX(0);
        this.isCharging = false;
        this.canJump = false;
        this.canCharge = false;
        this.animCharge = true;

        setTimeout(() => {
            this.canCharge = true;
            this.inputsMoveLocked = false;
            this.canJump = true;
        }, 700);
    }
}

export default PlayerHog