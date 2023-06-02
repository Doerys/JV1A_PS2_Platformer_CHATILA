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

            console.log(this.body.velocity.x)

            // gestion des animations
            this.animManager();

            // METHODE POUR MECANIQUES COMMUNES
            this.handlePlayer();

            // TIR PLUME
            if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.isShooting && this.canShoot) {

                this.canJump = false;
                this.isShooting = true;
                this.canShoot = false;
                this.prepareShootAnim = true;

                // fixe le joueur sur place
                this.inputsMoveLocked = true; // commandes bloquées
                this.body.setAllowGravity(false); //gravité annulée 
                this.setVelocityX(0);
                this.body.velocity.x = 0; // vélocité annulée
                this.body.velocity.y = 0



                setTimeout(() => {
                    const feather = new Projectile(this.scene, this.x + 64, this.y + 90, "feather").setDepth(-1).setOrigin(0, 0);
                    this.scene.projectilesPlayer.add(feather);
                    feather.shoot(this);

                    this.prepareShootAnim = false;
                    this.shootAnim = true;
                    this.canJump = true;

                    //this.inputsMoveLocked = false; // commandes débloquées
                    this.canJump = true;
                    this.body.setAllowGravity(true); //gravité rétablie

                    this.isShooting = false;
                }, 1000);

                setTimeout(() => {
                    this.canShoot = true;
                }, 1000);
            }
        }
    }
}

export default PlayerRaven