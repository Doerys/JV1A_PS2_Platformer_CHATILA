import Projectile from "./projectile.js";

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        this.hp = 1;

        this.speedMoveX = 0;
        this.speedXMax = 145;
        this.speedMoveY = 500;
        //this.speedMoveY = 1000;

        this.projectiles = new Phaser.GameObjects.Group;

        this.facing = 'right';

        this.inputsMoveLocked = false; // bloque les touches de déplacement latéraux
        
        this.canJump = true; // autorise le saut 
        this.startJumpTimer = false; // déclencher le timer du saut
        this.canHighJump = false; // autorise le fait de faire des sauts plus haut
        this.isJumping = false; 
        this.canPlane = false; // autorise de planer
        this.newJump = false; // permet de différencier un début de jump d'une fin de jump (pour le wall grab)

        this.jumpTimer = 0; // temps en secondes sur lequel on appuie sur la touche saut
        this.jumpCounter = 2; // le nombre de sauts restants (utile pour double jump)

        this.isCharging = false;

        this.accelerationX = 15;
        this.frictionGround = 50;

        this.setDamping(true);

        this.create(); // fonction qui permet de déclencher la fonction create (ne se fait pas automatiquement, car ce n'est pas une scène)
    }

    create() {

        // commandes
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        /*this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });*/
        // animation joueur
        this.scene.anims.create({
            key: 'player_idle',
            frames: [{ key: 'player', frame: 0 }],
        });

        this.scene.anims.create({
            key: 'player_left',
            frames: [{ key: 'player', frame: 1 }],
        });

        this.scene.anims.create({
            key: 'player_right',
            frames: [{ key: 'player', frame: 2 }],
        });
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

        const { // /!\ const = utilisable uniquement à l'intérieur d'une fonction
            left: keyLeft,
            right: keyRight,
            up: keyUp,
            down: keyDown,
        } = this.cursors;

        const upOnce = Phaser.Input.Keyboard.JustDown(keyUp); // variable correspondant à une pression instantanée du jump

        this.onGround = this.body.blocked.down; // verifie que le joueur est au sol
        this.blockedLeft = this.body.blocked.left; // verifie si le joueur est contre une paroi gauche
        this.blockedRight = this.body.blocked.right; // verifie si le joueur est contre une paroi droite

        if (this.onGround && !this.isCharging) {
            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            this.inputsMoveLocked = false;
            
            this.jumpCounter = 2; // si le joueur est au sol, réinitialise son compteur de jump
            this.isJumping = false;
            this.canPlane = false;
        }

        // Si on ne presse pas up et qu'on n'est pas au sol, on peut planer
        if (keyUp.isUp && !this.onGround){
            this.canPlane = true;
        }

        // ANIMATIONS - DEPLACEMENT 2 DIRECTIONS
        if (this.blockedRight || this.blockedLeft) { // STOP la vitesse du joueur d'un coup s'il entre en contact avec un mur
            this.speedMoveX = 0;
        }

        if (this.speedMoveX == 0) { // condition pour idle
            if (this.facing == 'right') {
                this.play('player_right', true);
            }
            if (this.facing == 'left') {
                this.play('player_left', true);
            }
        }

        // DEPLACEMENT A GAUCHE <=
        if ((keyLeft.isDown || this.keyQ.isDown /* || this.controller.left */) && this.inputsMoveLocked == false) { // si touche vers la gauche pressée

            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

            this.facing = 'left'; // rotation
            this.play('player_left', true);

            if (Math.abs(this.speedMoveX) < this.speedXMax) {
                this.speedMoveX -= this.accelerationX;
            }
            else {
                this.speedMoveX = -this.speedXMax;
            }
        }
        // DEPLACEMENT A DROITE =>
        else if ((keyRight.isDown || this.keyD.isDown /*|| this.controller.right */) && this.inputsMoveLocked == false) { // si touche vers la droite pressée

            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

            this.play('player_right', true);
            this.facing = 'right'; // rotation

            if (Math.abs(this.speedMoveX) < this.speedXMax) { // tant que la vitesse est inférieure à la vitesse max, on accélère 
                this.speedMoveX += this.accelerationX;
            }
            else {
                this.speedMoveX = this.speedXMax; // sinon, vitesse = vitesse max
            }
        }

        // frottement au sol
        if (keyLeft.isUp && keyRight.isUp && this.keyQ.isUp && this.keyD.isUp && /*!this.controller.left
            && !this.controller.right &&*/ (this.onGround || this.body.velocity.y == 0) && this.speedPlayer != 0) { // si aucune touche de déplacement pressée + bloqué au sol + pas de saut + pas déjà immobile

            //this.setDragX(0.0001); // pas fonctionnel encore

            if (Math.abs(this.speedMoveX) <= this.frictionGround) { //Math.abs => met la valeur entre parenthèse positive. Si la vitesse speedMoveX est inférieure ou égale à la friction, alors on met 0 direction.
                this.speedMoveX = 0
            }
            else if (this.speedMoveX > 0) { // si vitesse est supérieure (on va à gauche)
                this.speedMoveX -= this.frictionGround; // diminue la vitesse jusqu'à 0
            }
            else if (this.speedMoveX < 0) {
                this.speedMoveX += this.frictionGround; // augmente la vitesse jusqu'à 0
            }
        }

        if (this.keyA.isDown){
            console.log(this.jumpTimer.getElapsedSeconds());
            console.log(upOnce);
        }

        // SAUT (plus on appuie, plus on saut haut)
        // déclencheur du saut - C'est OKAY
        if (upOnce && this.canJump && this.jumpCounter > 0 && this.onGround) { // si on vient de presser saut + peut sauter true + au sol
            this.jumpPlayer();
        }

        /*// déclencheur du saut en l'air (utile pour double jump)
        else if (upOnce && this.canJump && this.jumpCounter > 0 && !this.canHighJump && (!this.grabLeft || this.grabRight)) {
            this.jumpPlayer();
        }*/

        // SAUT PLUS HAUT - allonge la hauteur du saut en fonction du timer
        else if (keyUp.isDown && this.canHighJump) { // si le curseur haut est pressé et jump timer =/= 0
            if (this.jumpTimer.getElapsedSeconds() > .3 || this.body.blocked.up) { // Si le timer du jump est supérieur à 12, le stoppe.
                this.canHighJump = false;
                setTimeout(() => {
                    this.canPlane = true;
                }, 300);
            } 
            else {
                // jump higher if holding jump 
                this.setVelocityY(-this.speedMoveY);
            }
        }

        // planer
        /*else if (keyUp.isDown && this.canPlane){
            this.setVelocityY(50);
        }*/

        // WALL JUMP

        // déclencheur du saut sans être en l'air
        else if (!this.onGround) {

            // WALL JUMP depuis mur GAUCHE
            if ((upOnce || keyRight.isDown) && this.grabLeft) {

                console.log("check wall jump gauche")

                this.jumpPlayer();

                this.facing = "right";

                this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabLeft = false; // désactive la variable du wallGrab

                this.setVelocityX(this.speedXMax); // repousse sur la gauche

                /*setTimeout(() => {
                    if(!this.grabLeft || !this.grabRight){
                    this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                    }
                }, 2500);*/
            }

            // WALL JUMP depuis mur DROIT
            if ((upOnce || keyLeft.isDown) && this.grabRight) {

                console.log("check wall jump droit")

                this.jumpPlayer();

                this.facing = "left";

                this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabRight = false; // désactive la variable du wallGrab

                this.setVelocityX(- this.speedXMax); // repousse sur la gauche

                /*setTimeout(() => {
                    if(!this.grabLeft || !this.grabRight){
                    this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                    }
                }, 2500);*/
            }
        }

        // WALL GRAB - on se fixe au mur une fois en contact avec lui

        // WALL GRAB GAUCHE
        if (this.blockedLeft && !this.onGround) { // si on est bloqué sur une paroi de gauche, et pas en contact avec le sol

            if (!this.newJump) { // si le saut actuel n'est pas nouveau

                console.log("check wall grab gauche")

                // fixe le joueur au mur
                this.body.setAllowGravity(false);
                this.setVelocityY(0);
                this.setVelocityX(-3);

                // verrouille les commandes de déplacement et valide le wall grab gauche
                this.inputsMoveLocked = true;
                this.grabLeft = true;
            }
        }

        // WALL GRAB DROIT
        else if (this.blockedRight && !this.onGround) { // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

            if (!this.newJump) { // si le saut actuel n'est pas nouveau

                console.log("check wall grab droit")

                // fixe le joueur au mur
                this.body.setAllowGravity(false);
                this.setVelocityY(0);
                this.setVelocityX(3);

                // verrouille les commandes de déplacement et valide le wall grab gauche
                this.inputsMoveLocked = true;
                this.grabRight = true;
            }
        }
        // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
        if ((this.grabLeft || this.grabRight) && keyDown.isDown) {

            this.body.setAllowGravity(true);
            this.setVelocityY(150);
            this.inputsMoveLocked = false;
        }

        // trigger de la charge
        /*if (!this.isCharging && Phaser.Input.Keyboard.JustDown(this.keyShift) && !this.isJumping) {
            this.isCharging = true;
        }*/

        // charge
        /*if (this.isCharging) {
            this.inputsMoveLocked = true;

            if (this.facing == 'right') {
                this.setVelocityX(this.speedMoveX) // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

                if (this.speedMoveX > this.speedXMax * 3) {
                    this.speedMoveX += this.accelerationX;
                }
                else {
                    this.speedMoveX = this.speedXMax * 3; // sinon, vitesse = vitesse max
                }
            }

            else if (this.facing == "left") {
                this.setVelocityX(this.speedMoveX)

                if (this.speedMoveX > this.speedXMax * 3) {
                    this.speedMoveX = -this.accelerationX;
                }
                else {
                    this.speedMoveX = -this.speedXMax * 3; // sinon, vitesse = vitesse max
                }
            }

            if (this.blockedLeft || this.blockedRight) {
                this.stopCharge();
            }
        }*/

        // GRAPPIN
        if (this.keyE.isDown){
            this.body.setAllowGravity(false);
            this.setVelocity(0, 0);

            this.inputsMoveLocked = true;

            //this.bout
            
            setTimeout(() => {
                this.inputsMoveLocked = false;
                this.body.setAllowGravity(true);
            }, 100); // après un certain temps, on repasse la possibilité de sauter à true
        }

        // TIR PLUME
        if (Phaser.Input.Keyboard.JustDown(this.keyShift)) {

                const feather = new Projectile(this.scene, this.x, this.y + 5);
                this.projectiles.add(feather);
                feather.shoot(this);
        }
    }

    jumpPlayer() {
        this.canJump = false; // ne peut plus sauter - FALSE
        this.canHighJump = true; // peut faire un saut haut
        this.newJump = true; // nouveau saut

        this.isJumping = true; // est en train de sauter - TRUE
        this.jumpCounter -= 1; // pour le double jump

        this.setVelocityY(-this.speedMoveY); // On set la vélocité Y à la force de base

        this.startJumpTimer = true; // on démarre le timer

        if (this.startJumpTimer == true) {
            this.startJumpTimer = false;
            this.jumpTimer = this.scene.time.addEvent({
                delay: 5000,                // ms
                loop: false
            });
        }

        setTimeout(() => {
            this.canJump = true;
            this.newJump = false;
        }, 100); // après un certain temps, on repasse la possibilité de sauter à true, et le saut n'est plus nouveau (pour le wall jump)
    }

    /*handleBoxCollision(player, box) {

        console.log(this.player);

        if (this.blockedRight) {
            this.futureX = this.box.x + (-1) * 64
        }
        else if (this.blockedLeft) {
            this.futureX = this.box.x + 1 * 64
        }

        // Vérifie si la position future de la caisse est valide (ne rentre pas en collision avec la plateforme)
        if (!this.layer_platforms.getTileAtWorldXY(this.futureX, this.box.y)) {
            // Déplace la caisse dans la direction déterminée
            this.box.x = this.futureX;

            // Déplace le joueur pour éviter le chevauchement
            if (this.body.blocked.right) {
                this.player.x += -1 * 64; // Déplace le joueur de la même distance que la caisse
            }
            else if (this.body.blocked.left) {
                this.player.x += 1 * 64; // Déplace le joueur de la même distance que la caisse
            }
        }
    }*/

    stopCharge() {
        this.inputsMoveLocked = false;
        this.setVelocityX(0);
        this.isCharging = false;
    }

    /*pushBox(player, box) {
        player.body.velocity.x = this.speedXMax - this.speedXMax - .25
        box.body.velocity.x = player.body.velocity.x

        if (player.body.blocked.right) {

        }

        player.body.velocity.x = this.speedXMax - this.speedXMax - .25
        box.body.velocity.x = player.body.velocity.x

    }*/
}

export default Player