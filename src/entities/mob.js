class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, facing, currentMob){
        super(scene, x, y, 'mob');

        this.facing = facing;
        this.currentMob = currentMob;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        this.speedMoveX = 100;
        this.isPassive = true;
        this.isPossessed = false;
    }

    create() {

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
    }

    patrolMob(){
        if (this.isPassive){
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

    disableIA() {
        this.isPossessed = true;
    }
}

export default Mob