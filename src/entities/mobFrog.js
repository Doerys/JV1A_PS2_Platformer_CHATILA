import Mob from "./mob.js";

class MobFrog extends Mob {
    constructor(scene, x, y, facing, currentMob) {
        super(scene, x, y, 'mobFrog');

        this.facing = facing;
        this.currentMob = currentMob;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        this.name = "Frog";
        super.init();
        this.isPossessed = false;

        console.log("new MOB FROG");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
    
        if (!this.isPossessed) {
            this.patrolMob();

            if (this.scene.activePossession) {
                const detectionZone = Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.x, this.y);
                
                if (detectionZone < 300) {
                    this.playerSpotted = true;

                    if (this.x < this.scene.player.x) {
                        this.facing = "left";
                    }

                    if (this.x > this.scene.player.x) {
                        this.facing = "right";
                    }
                }
                else {
                    this.playerSpotted = false;
                }
            }

            if(this.playerSpotted){
                if (this.facing == 'right' && !this.body.blocked.left){ 
                    this.setVelocityX(this.mobSpeedMoveX) // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
        
                    if (Math.abs(this.mobSpeedMoveX) < this.mobSpeedXMax *2) { // tant que la vitesse est inférieure à la vitesse max, on accélère 
                        this.mobSpeedMoveX += this.mobAccelerationX;
                    }
                    else {
                        this.mobSpeedMoveX = this.mobSpeedXMax *2; // sinon, vitesse = vitesse max
                    }
                }
        
                else if (this.facing == "left" && !this.body.blocked.right) {
                    this.setVelocityX(this.mobSpeedMoveX)
        
                    if (Math.abs(this.mobSpeedMoveX) < this.mobSpeedXMax *2) {
                        this.mobSpeedMoveX -= this.mobAccelerationX;
                    }
                    else {
                        this.mobSpeedMoveX = -this.mobSpeedXMax *2;
                    }
                }
            }
        }
    }
}

export default MobFrog