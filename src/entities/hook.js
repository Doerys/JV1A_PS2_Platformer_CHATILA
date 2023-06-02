class Hook extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, sprite){
        super(scene, x, y, sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }

    init(){
    }
}
export default Hook