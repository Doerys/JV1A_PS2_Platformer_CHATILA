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

        // VARIABLES UNIVERSELLES AUX MOBS

        this.isPossessed = false; // vérifie que le mob est possédé ou non (utile pour la méthode disableIA)
        this.playerSpotted = false; // changement de comportement si le joueur est détecté

        this.isPressingButton = false;

        this.canMove = true; // pas sûr que cette variable sert encore à quelque chose

        // VARIABLES MOB HOG
        this.isCharging = false;
        this.canCharge = true

        // VARIABLES RAVEN
        this.disableShoot = false;
    }

    create() {

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
    }

    // allers retours classiques
    patrolMob() {

        if (!this.playerSpotted) {

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

        const distanceX = this.scene.checkDistance(x2, x1);

        const distanceY = this.scene.checkDistance(y2, y1);

        if (distanceX < 300 && distanceY < 128 && !this.scene.playerKilled && !this.isCharging && this.canCharge) {
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
            this.isCharging = false;
        }
    }

    disableIA() {
        this.isPossessed = true;
    }
}

export default Mob