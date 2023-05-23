import Mob from "./mob.js";

class MobFrog extends Mob {
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

                    this.directionSpot = this.scene.checkDistance(this.x, this.scene.player.x);

                    if (this.directionSpot > 0) {
                        this.facing = "right";
                    }

                    if (this.directionSpot < 0) {
                        this.facing = "left";
                    }
                }
            }
        }

        //this.classicBehavior();
    }
}

export default MobFrog