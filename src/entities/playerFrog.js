import Player from "./player.js";
import Hook from "./hook.js";

class PlayerFrog extends Player {
    constructor(scene, x, y, facing, currentMob, haveCure) {
        super(scene, x, y, 'frogImage');

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

        this.jumpCounter = 1; // le nombre de sauts restants (utile pour double jump)

        console.log("PLAYER = FROG");

        //this.physics.add.collider(this.hook, layersmurs);

        if (!this.hookCreated) {
            this.hook = new Hook(this.scene, this.x + 64, this.y  + 64)
                .setCollideWorldBounds(true)
                .setOrigin(0.5, 0.5)
                .disableBody(true, true);

            this.hook.body.setAllowGravity(false);

            /*this.rope = this.physics.add.sprite(0, 0, 'rope')
                .setOrigin(0, 0.5)
            
            this.rope.body.setAllowGravity(false);
            this.rope.visible = false;*/

            this.hookCreated = true;
        }
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

            // WALL GRAB - on se fixe au mur une fois en contact avec lui

            // WALL GRAB GAUCHE
            if (this.blockedLeft && !this.onGround) { // si on est bloqué sur une paroi de gauche, et pas en contact avec le sol

                if (!this.newJump) { // si le saut actuel n'est pas nouveau

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);
                    this.setVelocityY(0);
                    this.setVelocityX(-3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabLeft = true;
                    this.isGrabing = true;
                }
            }

            // WALL GRAB DROIT
            else if (this.blockedRight && !this.onGround) { // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

                if (!this.newJump) { // si le saut actuel n'est pas nouveau

                    // fixe le joueur au mur
                    this.body.setAllowGravity(false);
                    this.setVelocityY(0);
                    this.setVelocityX(3);

                    // verrouille les commandes de déplacement et valide le wall grab gauche
                    this.inputsMoveLocked = true;
                    this.grabRight = true;
                    this.isGrabing = true;
                }
            }

            else if (!this.blockedLeft && !this.blockedRight && !this.onGround) {
                this.grabRight = false;
                this.grabLeft = false;
                this.isGrabing = false;
            }

            // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
            if ((this.grabLeft || this.grabRight) && (this.cursors.down.isDown || this.keyS.isDown)) {

                this.body.setAllowGravity(true);
                this.setVelocityY(200);
                this.inputsMoveLocked = false;
            }

            // GRAPPIN
            if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.isHooking && this.canHook) {

                this.isHooking = true;
                this.canHook = false;

                this.hook.enableBody();

                // place le hook à l'emplacement du personnage
                this.hook.x = this.x + 64;
                this.hook.y = this.y + 64;

                /*this.rope.x = this.x;
                this.rope.y = this.y;

                this.rope.visible = true;*/

                //PROJECTION HOOK (en fonction de l'orientation du perso, projette le grappin à droite ou à gauche)

                if (this.facing == "right") {
                    this.hook.setVelocityX(this.speedHook);
                }

                else if (this.facing == "left") {
                    this.hook.flipX = true;
                    this.hook.setVelocityX(-this.speedHook);
                }

                // fixe le joueur sur place
                this.inputsMoveLocked = true; // commandes bloquées
                this.body.setAllowGravity(false); //gravité annulée 
                this.setVelocity(0, 0); // vélocité annulée

                // réinitialise les variables et les mouvements du personnage
                setTimeout(() => {
                    this.canHook = true;
                    //this.isHooking = false; // n'est plus en train de grappiner
                    //this.inputsMoveLocked = false; // commandes débloquées
                    //this.body.setAllowGravity(true); //gravité rétablie 
                }, 100); // après un certain temps, on repasse la possibilité de sauter à true
            }

            // débloque les commandes après l'utilisation du grappin
            if (!this.isHooking && !this.grabLeft && !this.grabRight && this.canHook) {
                if (!this.isWallJumping) {
                    this.inputsMoveLocked = false; // commandes débloquées
                }
                this.body.setAllowGravity(true); //gravité rétablie
                this.inputsMoveLocked = false; // commandes débloquées
            }

            if (this.hookCreated) {

                // si la vélocité est à 0, ça fait disparaître les éléments
                if (this.hook.body.velocity.x == 0) {
                    this.hook.disableBody(true, true);
                    //this.rope.visible = false;
                    this.isHooking = false;
                }

                // si le grappin atteint la distance max : stoppe le grappin
                if (this.scene.checkDistance(this.x + 64, this.hook.x) >= this.maxHookDistance) { // longueur max de la chaine
                    this.hook.setVelocity(0);
                    this.hook.visible = false;
                    //this.rope.visible = false;
                    //this.rope.stop();
                    //this.rope.visible = false;
                }
            }
        }
    }
}

export default PlayerFrog