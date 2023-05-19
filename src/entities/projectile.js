class Projectile extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "feather");

        scene.physics.add.existing(this);
        this.init();
    }

    init(){
        this.speed = 250; 
        this.maxDistance = 150;
        this.traveledDistance = 0; 
        this.dir = null; 
    }

    shoot(player){
    
        if(player.facing == "right"){
            this.x = player.x + 15; 
            this.setVelocityX(this.speed); 
            this.body.setAllowGravity(false);
        }else if(player.facing == "left"){
            this.x = player.x - 15;
            this.setFlipX(true); 
            this.setVelocityX(-this.speed);
            this.body.setAllowGravity(false);
        }

    }

    hit(target){
        new SpriteEffect(this.scene, 0,0, "projectile_impact").playOn(target, this.y);
        if(target.protected){
            this.getDeflected();
        }else{
            this.particleEmmiter.stop(); 
            this.residuEmmiter.stop(); 
            this.destroy();
        }
    }

    getDeflected(){
        if(this.dir == "right"){
            this.setVelocityX(-this.speed); 
            this.setFlipX(true); 
            this.dir= "left";
        }else{
            this.setVelocityX(this.speed); 
            this.setFlipX(false); 
            this.dir= "right";
        }
        this.maxDistance = 500; 
    }

}

export default Projectile