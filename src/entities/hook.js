class Hook extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "hook");

        scene.physics.add.existing(this);
        this.init();
    }

    init(){
    }
}
export default Hook