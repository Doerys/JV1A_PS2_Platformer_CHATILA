class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, facing){
        super(scene, x, y, 'mob');

        this.facing = facing;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        this.speedMoveX = 100;
        this.isPassive = true;
    }

    create() {

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if(this.facing == "right"){
            this.setVelocityX(this.speedMoveX);
        }
        else if (this.facing == "left"){
            this.setVelocityX(-this.speedMoveX);
        }

        if(this.body.blocked.right){
            this.facing = "left";
        }
        else if(this.body.blocked.left){
            this.facing = "right";
        }
    }
}

export default Mob