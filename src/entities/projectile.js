class Projectile extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "feather");

        scene.physics.add.existing(this);
        this.init();
    }

    init(){
        this.speed = 500; 
        this.maxDistance = 150;
        this.traveledDistance = 0; 
        this.dir = null; 
    }

    shoot(shooter){
    
        if(shooter.facing == "right"){
            this.x = shooter.x + 15; 
            this.setVelocityX(this.speed);
            this.body.setAllowGravity(false);

            setTimeout(() => {
                this.body.setAllowGravity(true);
            }, 250);

        }else if(shooter.facing == "left"){
            this.x = shooter.x - 15;
            this.setFlipX(true); 
            this.setVelocityX(-this.speed);
            this.body.setAllowGravity(false);

            setTimeout(() => {
                this.body.setAllowGravity(true);
            }, 250);
        }

    }
}

export default Projectile