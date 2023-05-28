class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        this.speedMoveX = 0;
        this.speedXMax = 145;
        this.speedMoveY = 500;
        //this.speedMoveY = 1000;

        //this.projectiles = new Phaser.GameObjects.Group;

        /*this.hook = new Phaser.GameObjects.Group;
        this.rope = new Phaser.GameObjects.Group;*/

        // VARIABLES UNIVERSELLES A TOUS LES MOBS

        this.isPossessed = true; // actuellement en train de posséder qq   

        this.inputsMoveLocked = false; // bloque les touches de déplacement latéraux

        this.canJump = true; // autorise le saut 
        this.startJumpTimer = false; // déclencher le timer du saut
        this.canHighJump = false; // autorise le fait de faire des sauts plus haut
        this.isJumping = false;
        this.newJump = false; // permet de différencier un début de jump d'une fin de jump (pour le wall grab)

        this.jumpTimer = 0; // temps en secondes sur lequel on appuie sur la touche saut

        this.accelerationX = 15;
        this.frictionGround = 50;

        // VARIABLES FROG
        this.grabLeft = false;
        this.grabRight = false;
        this.isWallJumping = false;

        this.hookCreated = false;
        
        this.canHook = true;
        this.isHooking = false;

        this.speedHook = 1000;
        this.maxHookDistance = 256;

        this.stakeCatched = false;
        this.boxCatched = false;

        // VARIABLES HOG
        this.isCharging = false;
        this.canCharge = true;

        // VARIABLES RAVEN
        this.canPlane = false; // autorise de planer
        this.disableShoot = false;
        this.secondJump = false;

        this.setDamping(true);

        // commandes
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        /*this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });*/
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

    }

    basicMovements() {

        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up); // variable correspondant à une pression instantanée du jump
        this.ZOnce = Phaser.Input.Keyboard.JustDown(this.keyZ); // variable correspondant à une pression instantanée du jump

        this.onGround = this.body.blocked.down; // verifie que le joueur est au sol
        this.blockedLeft = this.body.blocked.left; // verifie si le joueur est contre une paroi gauche
        this.blockedRight = this.body.blocked.right; // verifie si le joueur est contre une paroi droite

        // ANIMATIONS
        if (this.speedMoveX == 0) { // condition pour idle
            if(this.currentMob == "frog") {
                if (this.facing == 'right') {
                    this.play('player_frog_right', true);
                }
                if (this.facing == 'left') {
                    this.play('player_frog_left', true);
                }
            }
        }

        // DEPLACEMENT A GAUCHE <=
        if ((this.cursors.left.isDown || this.keyQ.isDown /* || this.controller.left */) && !this.inputsMoveLocked) { // si touche vers la gauche pressée

            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

            this.facing = 'left'; // rotation
            //this.play('player_left', true);

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

            //this.play('player_right', true);
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

    simpleJump() {

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

    jumpMovements() {
        if (this.onGround && !this.newJump && !this.isHooking && !this.isCharging && this.canCharge) {

            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            this.inputsMoveLocked = false;
        
            if (this.currentMob == "raven") {
                this.jumpCounter = 2; // si le joueur est au sol, réinitialise son compteur de jump
            }
            else {
                this.jumpCounter = 1; // si le joueur est au sol, réinitialise son compteur de jump
            }

            this.isJumping = false;
            
            // REINITIALISATION RAVEN
            this.canPlane = false;
            this.secondJump = false;

            // REINITIALISATION FROG

            this.isWallJumping = false;
            
            this.grabRight = false;
            this.grabLeft = false;
        }
        
        // SAUT (plus on appuie, plus on saut haut)
        
        // déclencheur du saut
        if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && this.onGround) { // si on vient de presser saut + peut sauter true + au sol
            this.simpleJump();
        }
        
        else if ((this.cursors.up.isUp && this.keyZ.isUp) && this.canHighJump) {
            this.canHighJump = false; // évite de pouvoir spammer plutôt que de rester appuyer pour monter plus haut
        }
        
        // déclencheur du saut en l'air (utile pour double jump)
        else if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && !this.canHighJump && this.currentMob == "raven") {
            this.simpleJump();
            this.secondJump = true;
            this.canPlane = false;
        }
        
        // SAUT PLUS HAUT - allonge la hauteur du saut en fonction du timer
        else if ((this.cursors.up.isDown || this.keyZ.isDown) && this.canHighJump && !this.isHooking) { // si le curseur haut est pressé et jump timer =/= 0
            
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
        
        // planer - MECANIQUE RAVEN
        else if ((this.cursors.up.isDown || this.keyZ.isDown) && this.canPlane && this.currentMob == "raven") {
            this.setVelocityY(50);
        }
        
        // WALL JUMP - MECANIQUE FROG
        
        // déclencheur du saut sans être en l'air
        else if (!this.onGround && this.currentMob == "frog") {
        
            // WALL JUMP depuis mur GAUCHE
            if ((this.upOnce || this.ZOnce || this.cursors.right.isDown || this.keyD.isDown) && this.grabLeft) {
        
                this.simpleJump();

                this.isWallJumping = true;
        
                this.facing = "right";
        
                this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabLeft = false; // désactive la variable du wallGrab
        
                this.setVelocityX(this.speedXMax + 10); // repousse sur la gauche
        
                /*setTimeout(() => {
                    if(!this.grabLeft || !this.grabRight){
                    this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                    }
                }, 2500);*/
            }
        
            // WALL JUMP depuis mur DROIT
            if ((this.upOnce || this.ZOnce || this.cursors.left.isDown || this.keyQ.isDown) && this.grabRight) {
        
                this.simpleJump();
        
                this.facing = "left";

                this.isWallJumping = true;
        
                this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabRight = false; // désactive la variable du wallGrab
        
                this.setVelocityX(- this.speedXMax - 10); // repousse sur la gauche
        
                /*setTimeout(() => {
                    if(!this.grabLeft || !this.grabRight){
                    this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                    }
                }, 2500);*/
            }
        }
    }

    disablePlayer() {
        this.isPossessed = false;
    }
}

export default Player