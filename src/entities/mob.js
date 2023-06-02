class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, facing, sprite) {
        super(scene, x, y, sprite);

        this.facing = facing;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        // VARIABLES DE VITESSES

        this.mobSpeedMoveX = 0;
        this.mobAccelerationX = 100;
        this.mobSpeedXMax = 100;

        // VARIABLES D'ANIMATION

        this.jumpAnim = false;
        this.justFall = false;
        this.animCharge = false;
        this.justCreated = true;

        this.prepareShootAnim = false;
        this.shootAnim = false;

        // VARIABLES UNIVERSELLES AUX MOBS

        this.isPossessed = false; // vérifie que le mob est possédé ou non (utile pour la méthode disableIA)
        this.playerSpotted = false; // changement de comportement si le joueur est détecté

        this.isPressingButton = false;

        this.canMove = true; // permet de bloquer momentanément le hog après qu'il ait percuté un mur en chargeant

        // VARIABLES MOB HOG
        this.isCharging = false;
        this.canCharge = true

        // VARIABLES RAVEN
        this.isShooting = false;
        this.canShoot = true;
    }

    create() {

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
    }

    animMobManager() {

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
            else if (this.body.blocked.down) {

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

            // JUMP
            else if (this.body.velocity.y < 0 && !this.jumpAnim) {
                this.anims.play("player_frog_jump", true);
                this.jumpAnim = true;
            }

            // FALL
            else if (this.body.velocity.y > 0 && !this.fallAnim && !this.justCreated) {
                console.log("FALL MOB FROG");
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
                else if (this.justFall && !this.isCharging) {
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
            else if (this.body.velocity.y < 0 && !this.jumpAnim) {
                this.anims.play("player_hog_jump", true);
                this.jumpAnim = true;
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

                // si on se réceptionne durant l'anim de chute
                if (this.justFall && this.fallAnim) {
                    //console.log("CHUTE RECEPTION") //=> GOOD

                    this.anims.play("player_raven_fallToReception", true);
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

                // jump to fall
                if (this.jumpAnim) {
                    // console.log("fall true") //=> GOOD
                    this.anims.play("player_raven_jumpToFall", true);
                }

                else if (!this.firstFallAnim && !this.justCreated) {
                    this.anims.play("player_raven_groundtoFall", true);
                    this.firstFallAnim = true;

                    this.planeAnim = false;
                    this.fallAnim = true;
                }

                this.firstFallAnim = true; // désactive la chute sans saut
                this.jumpAnim = false;
                this.justFall = true;
            }

            // ANIM DE JUMP

            // si on va vers le haut
            if (this.body.velocity.y < 0) {
                if (!this.jumpAnim) {

                    if (this.body.blocked.down) {
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

    // allers retours classiques
    patrolMob() {

        if (!this.playerSpotted && !this.isCharging && this.canMove) {

            // DEPLACEMENT A GAUCHE <=
            if (this.facing == "left" && !this.body.blocked.right) {

                this.setVelocityX(this.mobSpeedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

                if (Math.abs(this.mobSpeedMoveX) < this.mobSpeedXMax) {
                    this.mobSpeedMoveX -= this.mobAccelerationX;
                }
                else {
                    this.mobSpeedMoveX = -this.mobSpeedXMax;
                }
            }
            // DEPLACEMENT A DROITE =>
            else if (this.facing == "right" && !this.body.blocked.left) {

                this.setVelocityX(this.mobSpeedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

                if (Math.abs(this.mobSpeedMoveX) < this.mobSpeedXMax) { // tant que la vitesse est inférieure à la vitesse max, on accélère 
                    this.mobSpeedMoveX += this.mobAccelerationX;
                }
                else {
                    this.mobSpeedMoveX = this.mobSpeedXMax; // sinon, vitesse = vitesse max
                }
            }

            if (this.body.blocked.right) {
                this.facing = "left";
            }
            else if (this.body.blocked.left) {
                this.facing = "right";
            }
        }
    }

    // méthode pour détecter le player à proximité
    detectionPlayer(x1, y1, x2, y2) {

        // constantes pour repérer distance entre mob et player

        const distanceX = this.scene.checkDistance(x2 + 64, x1 + 64);

        const distanceY = this.scene.checkDistance(y2 + 64, y1 + 64);

        if (distanceX < 250 && distanceY < 96 && !this.scene.playerKilled && !this.isCharging && this.canCharge) {
            this.playerSpotted = true;

            // on pivote le mob vers le joueur
            if (this.currentMob == "raven" || this.currentMob == "hog") {
                if (x1 < x2) {
                    this.facing = "left";
                }

                if (x1 > x2) {
                    this.facing = "right";
                }
            }
            else {
                if (x1 < x2) {
                    this.facing = "right";
                }

                if (x1 > x2) {
                    this.facing = "left";
                }
            }
        }

        // on réinitialise si le player est trop loin OU mort
        else if (distanceX > 300 || distanceY > 64 || this.scene.playerKilled) {
            this.playerSpotted = false;
        }
    }

    disableIA() {
        this.isPossessed = true;
    }
}

export default Mob