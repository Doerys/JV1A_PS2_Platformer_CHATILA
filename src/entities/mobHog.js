import Mob from "./mob.js";

class MobHog extends Mob {
    constructor(scene, x, y, facing, currentMob) {
        super(scene, x, y, 'mobHog');

        this.spawnX = x;
        this.spawnY = y;
        this.facing = facing;
        this.currentMob = currentMob;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        super.init();

        console.log("new MOB HOG");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        // check que le mob n'est pas possédé
        if (!this.isPossessed) {

            // aller retour si joueur n'est pas spotted
            this.patrolMob();

            // si le joueur possède un mob, détection du joueur
            if (this.scene.activePossession) {
                const detectionZone = Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.x, this.y);
                
                if (detectionZone < 300 && !this.scene.playerKilled) {
                    this.playerSpotted = true;

                    if (this.x < this.scene.player.x) {
                        this.facing = "right";
                    }

                    if (this.x > this.scene.player.x) {
                        this.facing = "left";
                    }
                }
                else if (detectionZone > 300 || this.scene.playerKilled) {
                    this.playerSpotted = false;
                }
                
                if(this.playerSpotted){
                    if (this.facing == 'right'){ 
                        this.setVelocityX(this.mobSpeedMoveX) // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            
                        if (this.mobSpeedMoveX > this.mobSpeedXMax * 3) {
                            this.mobSpeedMoveX += this.mobAccelerationX;
                        }
                        else {
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
    }
}

export default MobHog