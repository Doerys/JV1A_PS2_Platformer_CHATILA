class Projectile extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }

    init() {
        this.speed = 600;
        this.maxDistance = 150;
        this.traveledDistance = 0;
        this.dir = null;
    }

    shoot(shooter) {

        if (shooter.facing == "right") {
            this.x = shooter.x + 64;
            this.flipX = false;
            this.setVelocityX(this.speed);

        } else if (shooter.facing == "left") {
            this.x = shooter.x + 64;
            this.flipX = true;
            this.setVelocityX(-this.speed);
        }

        this.body.setAllowGravity(false);
        
        setTimeout(() => {
            // check si le projectile n'est pas destroy
            //if (!this.scene.playerKilled) {
                this.body.setAllowGravity(true);
            //}
        }, 350);

    }
}

export default Projectile