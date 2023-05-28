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
        this.isPossessed = false;
        this.playerSpotted = false;

        this.mobSpeedMoveX = 0;
        this.mobAccelerationX = 100;
        this.mobSpeedXMax = 100;

        this.isPressingButton = false;

        this.canMove = true;

        // VARIABLES MOB HOG
        this.isCharging = false;
        this.canCharge = true

        // VARIABLES RAVEN
        this.disableShoot = false;

        //this.projectiles = new Phaser.GameObjects.Group;
    }

    create() {

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
    }

    patrolMob() {

        if (!this.playerSpotted) {

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

    detectionPlayer(x1, y1, x2, y2) {
        const distanceX = this.scene.checkDistance(x2, x1);

        const distanceY = this.scene.checkDistance(y2, y1);

        if (distanceX < 300 && distanceY < 128 && !this.scene.playerKilled && !this.isCharging && this.canCharge) {
            this.playerSpotted = true;

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

        else if (distanceX > 300 || distanceY > 64 || this.scene.playerKilled) {
            this.playerSpotted = false;
            this.isCharging = false;
        }
    }

    disableIA() {
        this.isPossessed = true;
    }
}

export default Mob