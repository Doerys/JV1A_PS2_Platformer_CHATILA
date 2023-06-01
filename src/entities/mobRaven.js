import Mob from "./mob.js";
import Projectile from "./projectile.js";

class MobRaven extends Mob {
    constructor(scene, x, y, facing, currentMob, isCorrupted, haveCure) {
        super(scene, x, y, facing, "ravenImage");

        this.spawnX = x;
        this.spawnY = y;
        this.facing = facing;
        this.currentMob = currentMob;
        this.isCorrupted = isCorrupted;
        this.haveCure = haveCure;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        super.init();

        console.log("new MOB RAVEN");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        // check que le mob n'est pas possédé
        if (!this.isPossessed) {

            this.animMobManager();

            // aller retour si joueur n'est pas spotted
           this.patrolMob();

            if (this.scene.activePossession) {

                // si le joueur possède un mob, détection du joueur
                this.detectionPlayer(this.scene.player.x, this.scene.player.y, this.x, this.y);

                if (this.playerSpotted && !this.disableShoot) {

                    this.setVelocity(0, 0);

                    const feather = new Projectile(this.scene, this.x + 64, this.y + 90, "feather");
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