import Player from "./player.js";
import Projectile from "./projectile.js";

class PlayerRaven extends Player {
    constructor(scene, x, y, facing, currentMob, haveCure) {
        super(scene, x, y, 'ravenImage');

        this.facing = facing;
        this.currentMob = currentMob;
        this.haveCure = haveCure;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        super.init();

        this.jumpCounter = 2; // le nombre de sauts restants (utile pour double jump)

        console.log("PLAYER = RAVEN");
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        if (this.isPossessed) {

            // gestion des animations
            this.animManager();

            // METHODE POUR MECANIQUES COMMUNES
            this.handlePlayer();

            // TIR PLUME
            if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.disableShoot) {

                const feather = new Projectile(this.scene, this.x, this.y + 5, "feather");
                this.scene.projectilesPlayer.add(feather);
                this.disableShoot = true;
                feather.shoot(this);

                setTimeout(() => {
                    this.disableShoot = false;
                }, 500);
            }
        }
    }
}

export default PlayerRaven