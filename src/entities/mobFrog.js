import Mob from "./mob.js";

class MobFrog extends Mob {
    constructor(scene, x, y, facing) {
        super(scene, x, y, 'mob');

        this.facing = facing;

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
        }
    }
}

export default MobFrog