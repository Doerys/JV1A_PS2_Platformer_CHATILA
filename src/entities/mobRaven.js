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

        //console.log("new MOB RAVEN");
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

            if (this.scene.activePossession && !this.justCreated) {

                // si le joueur possède un mob, détection du joueur
                this.detectionPlayer(this.scene.player.x, this.scene.player.y, this.x, this.y);

                if (this.playerSpotted && !this.isShooting && this.canShoot) {

                    this.setVelocity(0, 0);
                    this.isShooting = true;
                    this.canShoot = false;
                    this.prepareShootAnim = true;

                    setTimeout(() => {
                        const feather = new Projectile(this.scene, this.x + 64, this.y + 90, "feather").setDepth(-1).setOrigin(0, 0);

                        if (!this.isCorrupted) {
                            feather.setTint(0x48d1cc);
                        }

                        else if (this.isCorrupted) {
                            feather.setTint(0xdc143c);
                        }

                        this.scene.projectilesMob.add(feather);
                        feather.shoot(this);

                        this.prepareShootAnim = false;
                        this.shootAnim = true;

                        this.isShooting = false;
                    }, 250);

                    setTimeout(() => {
                        this.canShoot = true;
                    }, 1000);
                }
            }
        }
    }
}

export default MobRaven