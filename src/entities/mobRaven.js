import Mob from "./mob.js";

class MobRaven extends Mob {
    constructor(scene, x, y, facing, currentMob) {
        super(scene, x, y, 'mob');

        this.facing = facing;
        this.currentMob = currentMob;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        super.init();

        console.log("new MOB RAVEN");
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
                        this.facing = "right";
                    }

                    if (this.x > this.scene.player.x) {
                        this.facing = "left";
                    }
                }
            }
        }

        //this.classicBehavior();
    }
}

export default MobRaven