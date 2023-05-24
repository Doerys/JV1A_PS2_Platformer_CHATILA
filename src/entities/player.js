class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
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

        //this.projectiles = new Phaser.GameObjects.Group;

        /*this.hook = new Phaser.GameObjects.Group;
        this.rope = new Phaser.GameObjects.Group;*/

        this.facing = 'right';

        this.currentlyPossess = true; // actuellement en train de posséder qq   

        this.inputsMoveLocked = false; // bloque les touches de déplacement latéraux

        this.canJump = true; // autorise le saut 
        this.startJumpTimer = false; // déclencher le timer du saut
        this.canHighJump = false; // autorise le fait de faire des sauts plus haut
        this.isJumping = false;
        this.canPlane = false; // autorise de planer
        this.newJump = false; // permet de différencier un début de jump d'une fin de jump (pour le wall grab)

        this.jumpTimer = 0; // temps en secondes sur lequel on appuie sur la touche saut

        this.isCharging = false;

        this.isHooking = false;
        this.canHook = true;

        this.accelerationX = 15;
        this.frictionGround = 50;

        this.setDamping(true);

        // commandes
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        /*this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });*/
        // animation joueur
        this.scene.anims.create({
            key: 'player_left',
            frames: [{ key: 'player', frame: 0 }],
        });

        this.scene.anims.create({
            key: 'player_right',
            frames: [{ key: 'player', frame: 1 }],
        });
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

    }

    basicMovements() {

        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up); // variable correspondant à une pression instantanée du jump
        this.zOnce = Phaser.Input.Keyboard.JustDown(this.keyZ); // variable correspondant à une pression instantanée du jump

        this.onGround = this.body.blocked.down; // verifie que le joueur est au sol
        this.blockedLeft = this.body.blocked.left; // verifie si le joueur est contre une paroi gauche
        this.blockedRight = this.body.blocked.right; // verifie si le joueur est contre une paroi droite

        /*if (this.onGround && !this.isCharging) {
            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            this.inputsMoveLocked = false;

            this.jumpCounter = 1; // si le joueur est au sol, réinitialise son compteur de jump
            this.isJumping = false;
            this.canPlane = false;
        }*/

        /*// Si on ne presse pas up et qu'on n'est pas au sol, on peut planer
        if (keyUp.isUp && this.keyZ.isUp && !this.onGround){
            this.canPlane = true;
        }*/

        // ANIMATIONS - DEPLACEMENT 2 DIRECTIONS
        /*if (this.blockedRight || this.blockedLeft) { // STOP la vitesse du joueur d'un coup s'il entre en contact avec un mur
            this.speedMoveX = 0;
        }*/

        if (this.speedMoveX == 0) { // condition pour idle
            if (this.facing == 'right') {
                this.play('player_right', true);
            }
            if (this.facing == 'left') {
                this.play('player_left', true);
            }
        }

        // DEPLACEMENT A GAUCHE <=
        if ((this.cursors.left.isDown || this.keyQ.isDown /* || this.controller.left */) && !this.inputsMoveLocked) { // si touche vers la gauche pressée

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
        else if ((this.cursors.right.isDown || this.keyD.isDown /*|| this.controller.right */) && !this.inputsMoveLocked) { // si touche vers la droite pressée

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
        if (this.cursors.left.isUp && this.cursors.right.isUp && this.keyQ.isUp && this.keyD.isUp && /*!this.controller.left
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

        if (this.keyA.isDown) {
            console.log(this.jumpTimer.getElapsedSeconds());
            console.log(this.upOnce);
        }
    }

    jumpPlayer() {

        this.setVelocityY(-this.speedMoveY); // On set la vélocité Y à la force de base

        this.startJumpTimer = true; // on démarre le timer
        this.canJump = false; // ne peut plus sauter - FALSE
        this.canHighJump = true; // peut faire un saut haut
        this.isJumping = true; // est en train de sauter - TRUE
        this.newJump = true; // nouveau saut

        this.jumpCounter -= 1; // pour le double jump

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

    disablePlayer() {
        this.currentlyPossess = false;
    }
}

export default Player