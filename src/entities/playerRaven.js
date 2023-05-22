import Player from "./player.js";
import Projectile from "./projectile.js";

class PlayerRaven extends Player {
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

        this.disableShoot = false;
        this.jumpCounter = 2; // le nombre de sauts restants (utile pour double jump)

        console.log("PLAYER = RAVEN");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.currentlyPossess) {

            console.log(this.jumpCounter);

            this.basicMovements();

            if (this.onGround && !this.isJumping) {

                this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
                this.inputsMoveLocked = false;
    
                this.jumpCounter = 2; // si le joueur est au sol, réinitialise son compteur de jump
                this.isJumping = false;
                this.canPlane = false;
            }

            /*
            // Si on ne presse pas up et qu'on n'est pas au sol, on peut planer
            if (this.cursors.up.isUp && this.keyZ.isUp && !this.onGround) {
                this.canPlane = true;
            }*/
            // SAUT (plus on appuie, plus on saut haut)

            // déclencheur du saut
            if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && this.onGround) { // si on vient de presser saut + peut sauter true + au sol
                this.jumpPlayer();
            }

            else if ((this.cursors.up.isUp && this.keyZ.isUp) && this.canHighJump) {
                this.canHighJump = false; // évite de pouvoir spammer plutôt que de rester appuyer pour monter plus haut
            }

            // déclencheur du saut en l'air (utile pour double jump)
            else if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && !this.canHighJump && (!this.grabLeft || this.grabRight)) {
                this.jumpPlayer();
            }

            else if ((this.cursors.up.isUp && this.keyZ.isUp) && this.canHighJump) {
                this.canHighJump = false; // on boucle pour le 2e saut
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

            /*
            // planer
            else if (this.cursors.up.isDown && this.canPlane) {
                this.setVelocityY(50);
            }
            */

            // TIR PLUME
            if (Phaser.Input.Keyboard.JustDown(this.keyShift) && !this.disableShoot) {

                const feather = new Projectile(this.scene, this.x, this.y + 5, "feather");
                this.projectiles.add(feather);
                this.disableShoot = true; 
                feather.shoot(this);

                setTimeout(() => {
                    this.disableShoot = false; 
                }, 500);
            }
        }
    }
}

export default PlayerRaven