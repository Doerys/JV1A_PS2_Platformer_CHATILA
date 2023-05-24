import Mob from "./mob.js";
import Projectile from "./projectile.js";

class MobRaven extends Mob {
    constructor(scene, x, y, facing, currentMob) {
        super(scene, x, y, 'mobRaven');

        this.spawnX = x;
        this.spawnY = y;
        this.facing = facing;
        this.currentMob = currentMob;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        super.init();

        this.disableShoot = false;

        console.log("new MOB RAVEN");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {      

        // check que le mob n'est pas possédé
        if (!this.isPossessed) {

            // aller retour si joueur n'est pas spotted
            this.patrolMob();

            // si le joueur possède un mob, détection du joueur
            if (this.scene.activePossession) {

                const detectionZone = Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.x, this.y);
                
                if (detectionZone < 300) {
                    this.playerSpotted = true;

                    if (this.x < this.scene.player.x) {
                        this.facing = "right";
                    }

                    if (this.x > this.scene.player.x) {
                        this.facing = "left";
                    }
                }

                else {
                    this.playerSpotted = false;
                }

                if(this.playerSpotted && !this.disableShoot){

                    console.log("FEEEUU")

                    this.setVelocity(0, 0);

                    const feather = new Projectile(this.scene, this.x, this.y + 5, "feather");
                    this.scene.projectilesMob.add(feather);
                    this.disableShoot = true;

                    feather.shoot(this);

                    setTimeout(() => {
                        this.disableShoot = false;
                    }, 1000);
                }
            }
        }
    }
}

export default MobRaven