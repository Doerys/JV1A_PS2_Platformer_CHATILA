class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {

        // VARIABLES DE VITESSES

        this.speedMoveX = 0;
        this.speedXMax = 145;
        this.speedMoveY = 550;

        this.accelerationX = 15;
        this.frictionGround = 50;

        /*this.hook = new Phaser.GameObjects.Group;
        this.rope = new Phaser.GameObjects.Group;*/

        // VARIABLES UNIVERSELLES A TOUS LES MOBS

        this.isPossessed = true; // vérifie que le mob est possédé ou non (utile pour la méthode disablePlayer)

        this.inputsMoveLocked = false; // bloque les touches de déplacement latéraux

        this.canJump = true; // autorise le saut 
        this.startJumpTimer = false; // déclencher le timer du saut
        this.canHighJump = false; // autorise le fait de faire des sauts plus haut
        this.isJumping = false;
        this.newJump = false; // permet de différencier un début de jump d'une fin de jump (pour le wall grab)

        this.jumpTimer = 0; // temps en secondes sur lequel on appuie sur la touche saut

        this.isPressingButton = false;

        // VARIABLES D'ANIMATION

        this.jumpAnim = false;
        this.justFall = false;
        this.animCharge = false;
        this.justCreated = true;

        this.hookAnim = false;
        this.throwHookAnim = false;
        this.animFallHook = false;

        this.prepareShootAnim = false;
        this.shootAnim = false;

        // VARIABLES FROG

        // wall jump
        this.grabLeft = false;
        this.grabRight = false;
        this.wasGrabingLeft = false;
        this.wasGrabingRight = false;

        this.isWallJumping = false;

        this.isGrabing = false;

        // grappin
        this.hookCreated = false;

        this.canHook = true;
        this.isHooking = false;
        this.returnHook = false;

        this.speedHook = 1500;
        this.maxHookDistance = 256;

        this.stakeCatched = false;
        this.boxCatched = false;

        // VARIABLES HOG
        this.isCharging = false;
        this.canCharge = true;

        // VARIABLES RAVEN
        this.canPlane = false; // autorise de planer
        this.secondJump = false;
        this.canShoot = true;
        this.isShooting = false;

        // COMMANDES

        // Touches directionnelles
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Action spéciale du Mob
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // récupération item
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // inputs en rab
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.setDamping(true);
    }

    initEvents() { // fonction qui permet de déclencher la fonction update
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {

    }

    // METHODE POUR MECANIQUES COMMUNES
    handlePlayer() {
        // déplacement latéraux
        this.basicMovements();

        // déplacement verticaux
        this.jumpMovements();

        // vérifie si on dépose l'item de soin
        this.scene.dropCure();
    }

    animManager() {

        // ANIMATIONS

        if (this.facing == 'right') {
            this.flipX = false;
        }
        if (this.facing == 'left') {
            this.flipX = true;
        }

        // ANIMATION FROG

        if (this.currentMob == "frog") {

            if (this.justCreated && this.body.velocity.x == 0) {
                this.play('player_frog_right', true);
            }

            // AU SOL
            else if (this.body.blocked.down && !this.isHooking && !this.throwHookAnim) {

                // RECEPTION
                if (this.justFall) {
                    this.anims.play("player_frog_reception", true);
                }

                // IDLE
                else if (this.body.velocity.x == 0 && this.body.velocity.y == 0 && !this.justFall) { // condition pour idle
                    this.play('player_frog_right', true);
                }

                // WALK
                else if (this.body.velocity.x != 0 && this.body.velocity.y == 0 && !this.justFall) {
                    this.anims.play("player_frog_walk", true);
                }

                setTimeout(() => {
                    this.justFall = false
                }, 100);

                this.jumpAnim = false;
                this.fallAnim = false;
                this.slideAnim = false;
            }

            // HOOK

            else if (this.isHooking && !this.throwHookAnim) {
                if (this.body.blocked.down) { // C'est okay
                    this.anims.play("player_frog_hookStartGround", true);
                }

                else if (this.jumpAnim) { // c'est okay
                    this.anims.play("player_frog_hookStartJump", true);
                }
                this.throwHookAnim = true;
            }

            if (this.throwHookAnim) {
                if (this.boxCatched || !this.isHooking) {
                    if (this.body.blocked.down) { // c'est okay
                        //console.log("AU SOL")
                        this.anims.play("player_frog_hookBackGround", true);
                    }

                    // anim foirée
                    /*else if (this.jumpAnim) { // ça a l'air okay
                        this.anims.play("player_frog_hookBackJump", true);
                    }*/

                    this.throwHookAnim = false;
                    this.animFallHook = true;
                }

                /*if (this.stakeCatched) {
                    
                    if (this.body.blocked.down) {
                        this.anims.play("player_frog_hookAttrackGround", true);
                    }

                    else if (this.jumpAnim) {
                        this.anims.play("player_frog_hookAttrackJump", true);
                    }            
                    
                    this.attrackAnim = true;
                }*/

                /*if (!this.stakeCatched && this.animFallHook && !this.body.blocked.down) {
                    console.log("CHUTE ELEGAANTE")
                    this.anims.play("player_frog_hookFall", true);
                }*/
            }

            // JUMP
            else if (this.body.velocity.y < 0 && !this.jumpAnim && !this.isHooking) {
                this.anims.play("player_frog_jump", true);
                this.jumpAnim = true;
            }

            // FALL
            else if (this.body.velocity.y > 0 && !this.fallAnim && !this.justCreated && !this.isHooking && !this.throwHookAnim && !this.animFallHook) {
                this.anims.play("player_frog_fall", true);
                this.fallAnim = true;
                this.justFall = true;
            }

            // GRAB WALL
            if (this.isGrabing) {
                if (this.body.velocity.y > 0) {
                    this.anims.play("player_frog_slideWall", true);
                    this.justFall = false;
                }

                if (this.body.velocity.y == 0) {
                    this.anims.play("player_frog_wallGrab", true);
                }
                this.jumpAnim = false;
                this.fallAnim = false;
            }
        }

        // ANIMATION HOG

        if (this.currentMob == "hog") {

            if (this.justCreated && this.body.velocity.x == 0) {
                this.play('player_hog_right', true);
            }

            // AU SOL
            else if (this.body.blocked.down) {

                if (this.animCharge) {

                    this.anims.play("player_hog_hit", true);

                    setTimeout(() => {
                        this.animCharge = false;
                    }, 700);
                }

                // RECEPTION
                else if (this.justFall) {
                    this.anims.play("player_hog_reception", true);
                }

                // IDLE

                else if (this.body.velocity.x == 0 && this.body.velocity.y == 0 && !this.justFall && !this.isCharging && !this.blockedLeft && !this.blockedRight && !this.animCharge) { // condition pour idle
                    this.play('player_hog_right', true);
                }

                // WALK
                else if (this.body.velocity.x != 0 && this.body.velocity.y == 0 && !this.justFall && !this.isCharging && !this.blockedLeft) {
                    this.anims.play("player_hog_walk", true);
                }

                // CHARGE
                else if (this.body.velocity.x != 0 && this.body.velocity.y == 0 && !this.justFall && this.isCharging) {
                    this.anims.play("player_hog_charge", true);
                }

                setTimeout(() => {
                    this.justFall = false
                }, 100);

                this.jumpAnim = false;
                this.fallAnim = false;
                this.slideAnim = false;
            }

            // JUMP
            else if (this.body.velocity.y < 0 && !this.jumpAnim && !this.isShooting) {
                this.anims.play("player_hog_jump", true);
                this.jumpAnim = true;
            }

            else if (this.prepareShootAnim) {
                this.anims.play("player_raven_prepareShootOnGround", true);
            }

            else if (this.shootAnim) {
                this.anims.play("player_raven_shootOnGround", true);
                setTimeout(() => {
                    this.shootAnim = false;
                }, 500);
            }

            // FALL
            else if (this.body.velocity.y > 0 && !this.fallAnim && !this.justCreated) {
                this.anims.play("player_hog_fall", true);
                this.fallAnim = true;
                this.justFall = true;
            }
        }

        // ANIMATIONS RAVEN
        if (this.currentMob == "raven") {

            if (this.justCreated && this.body.velocity.x == 0) {
                this.play('player_raven_right', true);
            }

            else if (this.body.blocked.down && !this.isShooting) {

                // RECEPTION
                if (this.justFall) {

                    // si on se réceptionne durant l'anim planer
                    if (this.planeAnim) {
                        //console.log("CHUTE PLANE") //=> GOOD

                        this.anims.play("player_raven_planeToReception", true);
                    }

                    // si on se réceptionne durant l'anim de chute
                    else if (this.fallAnim) {
                        //console.log("CHUTE RECEPTION") //=> GOOD

                        this.anims.play("player_raven_fallToReception", true);
                    }
                }

                // IDLE
                else if (this.body.velocity.x == 0 && this.body.velocity.y == 0 && !this.justFall && !this.isShooting && !this.shootAnim) { // condition pour idle
                    //console.log("IDLE")
                    this.play('player_raven_right', true);
                }

                // WALK
                else if (this.body.velocity.x != 0 && this.body.velocity.y == 0 && !this.justFall && !this.isShooting && !this.shootAnim) {
                    this.anims.play("player_raven_walk", true);
                }

                this.jumpAnim = false;
                this.fallAnim = false;
                this.planeAnim = false;
                this.doubleJumpAnim = false;

                setTimeout(() => {
                    this.justFall = false
                    this.firstFallAnim = false;
                }, 250);
            }

            // PREPARE SHOOT
            if (this.prepareShootAnim) {
                if (this.jumpAnim) {
                    this.anims.play("player_raven_prepareShootOnJump", true);
                    this.jumpAnim = false;
                }

                else if (this.planeAnim) {
                    this.anims.play("player_raven_prepareShootOnPlane", true);
                    this.planeAnim = false;
                }

                else if (this.body.blocked.down) {
                    this.anims.play("player_raven_prepareShootOnGround", true);
                }
            }

            // SHOOT
            else if (this.shootAnim) {
                if (!this.body.blocked.down) {
                    this.anims.play("player_raven_shootOnAir", true);
                    setTimeout(() => {
                        this.shootAnim = false;
                    }, 250);
                }
                else {
                    this.anims.play("player_raven_shootOnGround", true);
                    setTimeout(() => {
                        this.shootAnim = false;
                    }, 500);
                }
            }

            // si on va vers le bas
            if (this.body.velocity.y > 0) {

                // PLANER
                if (this.cursors.up.isDown || this.keyZ.isDown && !this.isShooting && !this.shootAnim) {

                    // passage de jump à plane
                    if (this.jumpAnim) {
                        //console.log("JUMP TO PLANE") => GOOD
                        this.anims.play("player_raven_jumpToPlane", true);
                    }

                    // passage de fall à plane
                    if (this.fallAnim) {
                        //console.log("FALL TO PLANE") //=> GOOD
                        this.anims.play("player_raven_fallToPlane", true);
                    }

                    this.planeAnim = true;
                    this.fallAnim = false;
                }

                // CHUTE
                if ((this.cursors.up.isUp && this.keyZ.isUp && !this.shootAnim)) {

                    // jump to fall
                    if (this.jumpAnim) {
                        // console.log("fall true") //=> GOOD
                        this.anims.play("player_raven_jumpToFall", true);
                    }

                    // plane to fall
                    else if (this.planeAnim) {
                        // console.log("plane true"); //=> GOOD
                        this.anims.play("player_raven_planeToFall", true);
                    }

                    else if (!this.firstFallAnim && !this.justCreated) {
                        this.anims.play("player_raven_groundtoFall", true);
                        this.firstFallAnim = true;
                    }

                    this.planeAnim = false;
                    this.fallAnim = true;
                }

                this.firstFallAnim = true; // désactive la chute sans saut
                this.jumpAnim = false;
                this.justFall = true;
            }

            // ANIM DE JUMP

            // si on va vers le haut
            if (this.body.velocity.y < 0 && !this.isShooting && !this.shootAnim) {
                if (!this.jumpAnim) {

                    if (this.body.blocked.downd) {
                        //console.log("GROUND TO JUMP"); //=> GOOD

                        this.anims.play("player_raven_groundToJump", true);
                    }

                    else {
                        //console.log("FALL TO JUMP");

                        this.anims.play("player_raven_fallToJump", true);
                        this.fallAnim = false;
                    }

                    /*if (this.planeAnim && this.fallAnim) {
                        console.log("PLANE TO JUMP"); 
        
                        this.anims.play("player_raven_planeToJump", true);
                        this.planeAnim = false;
                    }*/

                    this.jumpAnim = true;
                    this.justFall = true;
                }

                if (this.jumpAnim && this.secondJump && !this.doubleJumpAnim && !this.justFall) {
                    //console.log("DOUBLE JUMP")
                    this.anims.play("player_raven_doubleJump", true);
                    this.doubleJumpAnim = true;
                }
            }
        }
    }

    // gauche / droite
    basicMovements() {

        // détections d'inputs 'justDown'
        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up); // variable correspondant à une pression instantanée du jump
        this.ZOnce = Phaser.Input.Keyboard.JustDown(this.keyZ); // variable correspondant à une pression instantanée du jump

        // détections de collisions
        this.onGround = this.body.blocked.down; // verifie que le joueur est au sol
        this.blockedLeft = this.body.blocked.left; // verifie si le joueur est contre une paroi gauche
        this.blockedRight = this.body.blocked.right; // verifie si le joueur est contre une paroi droite

        // SI DEUX INPUTS PRESSES => IMMOBILE
        if ((this.cursors.right.isDown || this.keyD.isDown /*|| this.controller.right */) && (this.cursors.left.isDown || this.keyQ.isDown /* || this.controller.left */) && !this.inputsMoveLocked) { // si touche vers la droite pressée
            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            this.speedMoveX = 0;
        }

        if (this.currentMob == "raven") { // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions. (/!\ Cause des soucis au wall jump du frog)
            this.setVelocityX(this.speedMoveX);
        }

        // DEPLACEMENT A GAUCHE <=
        if ((this.cursors.left.isDown || this.keyQ.isDown /* || this.controller.left */) && !this.inputsMoveLocked && !this.isHooking && this.canHook && !this.isShooting) { // si touche vers la gauche pressée
            this.facing = 'left'; // rotation


            if (this.currentMob != "raven") {
                this.setVelocityX(this.speedMoveX);
            }

            if (Math.abs(this.speedMoveX) < this.speedXMax) {
                this.speedMoveX -= this.accelerationX;
            }
            else {
                this.speedMoveX = -this.speedXMax;
            }
        }
        // DEPLACEMENT A DROITE =>
        else if (((this.cursors.right.isDown || this.keyD.isDown /*|| this.controller.right */) && !this.inputsMoveLocked && !this.isHooking && this.canHook && !this.isShooting) || this.scene.reachNewLevel) { // si touche vers la droite pressée
            this.facing = 'right'; // rotation

            if (this.currentMob != "raven") {
                this.setVelocityX(this.speedMoveX);
            }

            if (Math.abs(this.speedMoveX) < this.speedXMax) { // tant que la vitesse est inférieure à la vitesse max, on accélère 
                this.speedMoveX += this.accelerationX;
            }
            else {
                this.speedMoveX = this.speedXMax; // sinon, vitesse = vitesse max
            }
        }

        // frottement au sol
        if (this.cursors.left.isUp && this.cursors.right.isUp && this.keyQ.isUp && this.keyD.isUp && /*!this.controller.left
            && !this.controller.right &&*/ (this.onGround || this.body.velocity.y == 0) && this.speedPlayer != 0 && !this.scene.reachNewLevel) { // si aucune touche de déplacement pressée + bloqué au sol + pas de saut + pas déjà immobile

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
    }

    simpleJump() {

        this.setVelocityY(-this.speedMoveY); // On set la vélocité Y à la force de base

        this.startJumpTimer = true; // on démarre le timer
        this.canJump = false; // ne peut plus sauter - FALSE
        this.canHighJump = true; // peut faire un saut haut
        this.isJumping = true; // est en train de sauter - TRUE
        this.newJump = true; // nouveau saut

        this.jumpCounter -= 1; // pour le double jump

        // start timer -> calcule la longueur des sauts au fur et à mesure de la pression de l'input
        if (this.startJumpTimer == true) {
            this.startJumpTimer = false;
            this.jumpTimer = this.scene.time.addEvent({
                delay: 5000,                // ms
                loop: false
            });
        }

        setTimeout(() => {
            this.canJump = true;
            this.newJump = false; // le saut n'est plus nouveau (utile pour le wall jump)
        }, 100);
    }

    jumpMovements() {

        // réinitilise des variables quand on est au sol
        if (this.onGround && !this.newJump && !this.isHooking && this.canCharge && !this.isShooting) {

            // si le joueur est au sol, réinitialise son compteur de jump
            if (this.currentMob == "raven") {
                this.jumpCounter = 2;
            }
            else {
                this.jumpCounter = 1;
            }

            if (!this.isCharging) {
                this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
                this.inputsMoveLocked = false;
                this.isJumping = false;

                // REINITIALISATION RAVEN
                this.canPlane = false;
                this.secondJump = false;

                // REINITIALISATION FROG

                this.isWallJumping = false;

                this.grabRight = false;
                this.grabLeft = false;
                this.wasGrabingLeft = false;
                this.wasGrabingRight = false;
                this.isGrabing = false;
            }
        }

        // Si on ne presse pas up et qu'on n'est pas au sol, on peut planer
        if (this.cursors.up.isUp && this.keyZ.isUp && !this.onGround) {
            this.canPlane = true;
        }

        // SAUT (plus on appuie, plus on saut haut)

        // déclencheur du saut
        if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && this.onGround && !this.isShooting && this.canHook) { // si on vient de presser saut + peut sauter true + au sol
            this.simpleJump();
        }

        else if ((this.cursors.up.isUp && this.keyZ.isUp) && this.canHighJump && !this.wasGrabingLeft && !this.wasGrabingRight) {
            this.canHighJump = false; // contraint de rester appuyé pour monter plus haut (évite de pouvoir spammer à la place) 
        }

        // déclencheur du saut en l'air (utile pour double jump)
        else if ((this.upOnce || this.ZOnce) && this.canJump && this.jumpCounter > 0 && !this.canHighJump && this.currentMob == "raven" && !this.isShooting) {
            this.simpleJump();
            this.secondJump = true;
            this.canPlane = false;

            this.fallAnim = false;
            this.justFall = false;
        }

        // SAUT PLUS HAUT - allonge la hauteur du saut en fonction du timer
        else if (this.canHighJump && this.canJump && !this.isHooking && this.canHook) { // si le curseur haut est pressé et jump timer =/= 0

            if ((this.cursors.up.isDown || this.keyZ.isDown)) {
                if (this.jumpTimer.getElapsedSeconds() > .3 || this.body.blocked.up) { // Si le timer du jump est supérieur à 12, le stoppe.
                    this.canHighJump = false;
                    setTimeout(() => {
                        this.canPlane = true;
                    }, 300);
                }
                else {
                    // saute plus haut si on reste appuyé sur l'input de saut
                    this.setVelocityY(-this.speedMoveY);
                }
            }

            else if ((this.wasGrabingRight && (this.cursors.left.isDown || this.keyQ.isDown)) || (this.wasGrabingLeft && (this.cursors.right.isDown || this.keyD.isDown))) {
                if (this.jumpTimer.getElapsedSeconds() > .3 || this.body.blocked.up) { // Si le timer du jump est supérieur à 12, le stoppe.
                    this.canHighJump = false;
                    setTimeout(() => {
                        this.canPlane = true;
                    }, 300);
                }
                else {
                    // saute plus haut si on reste appuyé sur l'input de saut
                    this.setVelocityY(-this.speedMoveY);
                }
            }
        }

        // planer - MECANIQUE RAVEN
        else if ((this.cursors.up.isDown || this.keyZ.isDown) && this.canPlane && this.currentMob == "raven" && !this.isShooting) {
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

    // sert pour les possessions de mobs -> désative l'update, pour éviter les crashs de console
    disablePlayer() {
        this.isPossessed = false;
    }
}

export default Player