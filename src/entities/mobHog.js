import Mob from "./mob.js";

class MobHog extends Mob {
    constructor(scene, x, y, facing, currentMob, isCorrupted, haveCure) {
        super(scene, x, y, facing, 'hogImage');

        this.spawnX = x;
        this.spawnY = y;
        this.facing = facing;
        this.currentMob = currentMob;
        this.isCorrupted = isCorrupted;
        this.haveCure = haveCure;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        super.init();

        //console.log("new MOB HOG");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        // check que le mob n'est pas possédé
        if (!this.isPossessed) {

            this.animMobManager();

            //console.log("MOB HOG PRESSING BUTTON :" + this.isPressingButton);

            if (!this.isPressingButton) {
                this.patrolMob();
            }
            else if (!this.playerSpotted) {
                this.setVelocityX(0, 0);
            }

            if (this.scene.activePossession && !this.justCreated) {

                // si le joueur possède un mob, détection du joueur
                this.detectionPlayer(this.scene.player.x, this.scene.player.y, this.x, this.y);

                if (this.playerSpotted) {
                    this.isCharging = true;
                }

                if (this.isCharging) {
                    if (this.facing == 'right') {
                        this.setVelocityX(this.mobSpeedMoveX) // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

                        if (this.mobSpeedMoveX > this.mobSpeedXMax * 3) {
                            this.mobSpeedMoveX += this.mobAccelerationX;
                        }
                        else {
                            //console.log("CHECK CHARGE MOB HOG")
                            this.mobSpeedMoveX = this.mobSpeedXMax * 3; // sinon, vitesse = vitesse max
                        }
                    }

                    else if (this.facing == "left") {
                        this.setVelocityX(this.mobSpeedMoveX)

                        if (this.mobSpeedMoveX > this.mobSpeedXMax * 3) {
                            this.mobSpeedMoveX = -this.mobAccelerationX;
                        }
                        else {
                            this.mobSpeedMoveX = -this.mobSpeedXMax * 3; // sinon, vitesse = vitesse max
                        }
                    }

                    if (this.body.blocked.left || this.body.blocked.right) {
                        this.stopCharge();
                    }
                }
            }
        }
    }

    stopCharge() {
        this.setVelocityX(0);
        this.canCharge = false;
        this.isCharging = false;
        this.canMove = false;
        this.animCharge = true;

        setTimeout(() => {
            this.canCharge = true;
            this.canMove = true;
        }, 700);
    }
}

export default MobHog