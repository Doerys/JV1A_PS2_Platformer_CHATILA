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

    /*createPlat(proj, plat){
        
        this.scene.add.physics.sprite(plat.x, plat.y, "ravenPlatOn");
        plat.destroy();
        proj.destroy();
        // créer une plateforme de telle taille, à telles coordonnées liées à la plateforme, 
        // destroy proj
        //destroy plat
        
    }*/

    hit(target){
        console.log("check");
        this.destroy();
        target.destroy();
    }

    /*getDeflected(){
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
    }*/

}

export default Projectile