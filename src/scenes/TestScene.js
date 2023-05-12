class TestScene extends Phaser.Scene {

    constructor() {
        super('TestScene');
    }

    preload() {

        // Perso test
        this.load.spritesheet('player', 'src/scenes/player_test.png',
            { frameWidth: 64, frameHeight: 128});

        this.load.image('tiles_test', 'src/scenes/placeholder_test.png'); //Tileset        
        
        this.load.tilemapTiledJSON('map_test', 'src/scenes/testScene.json'); //fichier JSON

        this.spawnX = 96;
        this.spawnY = 1472;
    }

    create(){

        this.controller = false;
        
        // load de la map
        this.map_Test = this.add.tilemap("map_test");
        this.tileset_Test = this.map_Test.addTilesetImage('placeholder_test', 'tiles_test');

        // load des layers
        this.layer_platforms = this.map_Test.createLayer('layer_platforms', this.tileset_Test);
        this.layer_platforms.setCollisionByProperty({ estSolide: true });

        // load personnage
        this.player = this.physics.add.sprite(this.spawnX, this.spawnY, 'player');

        // animation joueur
        this.anims.create({
            key: 'player_idle',
            frames: [{ key: 'player', frame: 0 }],
        });

        this.anims.create({
            key: 'player_left',
            frames: [{ key: 'player', frame: 1 }],
        });

        this.anims.create({
            key: 'player_right',
            frames: [{ key: 'player', frame: 2 }],
        });

        // commandes
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        // PLAYER - Collision entre le joueur et les limites du niveau
        this.player.setCollideWorldBounds(true);

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728);
        this.cameras.main.setSize(3072, 1728)  ; //format 16/9

        // constantes
        this.speedMoveX = 0;
        this.speedXMax = 145;
        this.speedMoveY = 500;
        //this.speedMoveY = 1000;

        this.canJump = true;
        
        this.jumpCounter = 1;
        this.isJumping = false;
        
        this.accelerationX = 15;
        this.frictionGround = 15; 
    
        this.inputsMoveLocked = false;
        
        this.physics.add.collider(this.player, this.layer_platforms);

    }

    update () {

        if (this.onGround){
            this.player.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            this.inputsMoveLocked = false;
            this.jumpCounter = 1; // si le joueur est au sol, réinitialise son compteur de jump
        }

        // ANIMATIONS - DEPLACEMENT 2 DIRECTIONS
        if (this.player.body.blocked.right || this.player.body.blocked.left) { // STOP la vitesse du joueur d'un coup s'il entre en contact avec un mur
            this.speedMoveX = 0;
        }

        if (this.speedMoveX == 0) { // condition pour idle
            if (this.playerFacing == 'right') {
                this.player.anims.play('player_right', true);
            }
            if (this.playerFacing == 'left') {
                this.player.anims.play('player_left', true);
            }
        }
        
        // DEPLACEMENT 2 DIRECTIONS

        /*if ((this.cursors.left.isDown || this.keyQ.isDown || this.controller.left) && this.inputsMoveLocked == false){
            this.playerFacing = 'left';

            this.player.body.velocity.x -= this.accelerationX;
            this.player.setFlipX(0);

        } else if ((this.cursors.right.isDown || this.keyD.isDown || this.controller.right) && this.inputsMoveLocked == false){
            this.playerFacing = 'right';

            this.player.body.velocity.x += this.accelerationX;
            this.player.setFlipX(1);

        } else {
            if (this.onGround){
                // set ground acceleration
                this.player.setAccelerationX(((this.player.body.velocity.x > 0) ? -1 : 1) * this.accelerationX * 1.5);
            } else {
                // set air acceleration
                this.player.setAccelerationX(((this.player.body.velocity.x > 0) ? -1 : 1) * this.accelerationX / 1.5);
            }

            // reset velocity and acceleration when slow enough
            if (Math.abs(this.player.body.velocity.x) < 20 && Math.abs(this.player.body.velocity.x) > -20) {
                this.player.setVelocityX(0);
                this.player.setAccelerationX(0);
            }
        }*/

        ///////////////////////////////

        
        // DEPLACEMENT A GAUCHE <=
        if ((this.cursors.left.isDown || this.keyQ.isDown || this.controller.left) && this.inputsMoveLocked == false) { // si touche vers la gauche pressée

            this.player.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

            this.playerFacing = 'left'; // rotation
            this.player.anims.play('player_left', true);

            if (Math.abs(this.speedMoveX) < this.speedXMax) {
                this.speedMoveX -= this.accelerationX;
            }
            else {
                this.speedMoveX = -this.speedXMax;
            }
        }
        // DEPLACEMENT A DROITE =>
        else if ((this.cursors.right.isDown || this.keyD.isDown || this.controller.right) && this.inputsMoveLocked == false) { // si touche vers la droite pressée

            this.player.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            
            this.player.anims.play('player_right', true);
            this.playerFacing = 'right'; // rotation

            if (Math.abs(this.speedMoveX) < this.speedXMax) { // tant que la vitesse de la vitesse est inférieure à la vitesse max, on accélère 
                this.speedMoveX += this.accelerationX;
            }
            else {
                this.speedMoveX = this.speedXMax; // sinon, vitesse = vitesse max
            }
        }
        

        // frottement au sol
        if (this.cursors.left.isUp && this.cursors.right.isUp && this.keyQ.isUp && this.keyD.isUp && !this.controller.left
            && !this.controller.right && (this.player.body.blocked.down || this.player.body.velocity.y == 0) && this.speedPlayer != 0) { // si aucune touche de déplacement pressée + bloqué au sol + pas de saut + pas déjà immobile

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

        this.onGround = this.player.body.blocked.down; // verifie que le joueur est au sol
		this.blockedLeft = this.player.body.blocked.left; // verifie si le joueur est contre une paroi gauche
		this.blockedRight = this.player.body.blocked.right; // verifie si le joueur est contre une paroi droite

        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up); // variable correspondant à une pression instantanée du jump

        // SAUT (plus on appuie, plus on saut haut)
        
        // déclencheur du saut
        if (this.upOnce && this.canJump && this.jumpCounter > 0 && this.onGround){ // si on vient de presser saut + peut sauter true + au sol
            this.jumpTimer = 1; // création jump timer
            this.canJump = false; // ne peut plus sauter - FALSE
            this.jumpCounter -= 1;
            this.isJumping = true; // est en train de sauter - TRUE
            this.player.setVelocityY(-this.speedMoveY); // On set la vélocité Y à la force de base

            setTimeout(() => {
                this.canJump = true;
            }, 100); // après un certain temps, on repasse la possibilité de sauter à true
        }

        /*// déclencheur du saut en l'air (utile pour double jump)
        else if (this.upOnce && this.canJump && this.jumpCounter > 0){
            this.jumpTimer = 1; // création jump timer
            this.canJump = false; // ne peut plus sauter - FALSE
            this.jumpCounter -= 1;
            this.isJumping = true; // est en train de sauter - TRUE
            this.player.setVelocityY(-this.speedMoveY); // On set la vélocité Y à la force de base

            setTimeout(() => {
                this.canJump = true;
            }, 100); // après un certain temps, on repasse la possibilité de sauter à true
        }*/
        
        // SAUT PLUS HAUT - allonge la hauteur du saut en fonction du timer
        else if (this.cursors.up.isDown && this.jumpTimer != 0){ // si le curseur haut est pressé et jump timer =/= 0
            if (this.jumpTimer > 24 || this.player.body.blocked.up) { // Si le timer du jump est supérieur à 12, le stoppe.
                this.jumpTimer = 0;
            } else {
                // jump higher if holding jump
                this.jumpTimer++; // on imcrémente au fur et à mesure
                this.player.setVelocityY(-this.speedMoveY);
            }

        // réinitialise le timer du jump
        } else if (this.jumpTimer != 0){
            this.jumpTimer = 0;
        }

        // WALL JUMP
        
        // déclencheur du saut sans être en l'air
        else if (!this.onGround){
			
            // WALL JUMP depuis mur GAUCHE
            if ((this.upOnce || this.cursors.right.isDown) && this.grabLeft){
				
                // relance le timer
                this.jumpTimer = 1; // réinitialisation du timer
                this.canJump = false; // désactive la possibilité de jumper
                this.isJumping = true; // actuellement en train de jumper

                this.player.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabLeft = false; // désactive la variable du wallGrab
 
                this.player.setVelocityX(this.speedXMax); // repousse sur la gauche
                this.player.setVelocityY(-this.speedMoveY); // pulsion vers le haut

                setTimeout(() => { 
                    this.canJump = true; // réactivation de la possibilité de jump
                }, 100);

                /*setTimeout(() => {    
                    if(!this.grabLeft || !this.grabRight){
                    this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                    }
                }, 1000);*/
			}

            // WALL JUMP depuis mur DROIT
			if ((this.upOnce || this.cursors.left.isDown) && this.grabRight){
				
                this.jumpTimer = 1; // réinitialisation du timer
                this.canJump = false; // désactive la possibilité de jumper
                this.isJumping = true; // actuellement en train de jumper
    
                this.player.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabRight = false; // désactive la variable du wallGrab

                this.player.setVelocityX(- this.speedXMax); // repousse sur la gauche
                this.player.setVelocityY(- this.speedMoveY); // pulsion vers le haut

                setTimeout(() => { 
                    this.canJump = true; // réactivation de la possibilité de jump
                }, 100);

                /*setTimeout(() => {
                    if(!this.grabLeft || !this.grabRight){
                    this.inputsMoveLocked = false; // réactive les touches de mouvement du joueur
                    }
                }, 1000);*/
			}
		}

        // WALL GRAB - on se fixe au mur une fois en contact avec lui

        // WALL GRAB GAUCHE
        if(this.blockedLeft && !this.onGround){ // si on est bloqué sur une paroi de gauche, et pas en contact avec le sol

            if (!this.cursors.up.isDown){ // si on appuie pas sur la touche de droite

                // fixe le joueur au mur
                this.player.body.setAllowGravity(false);
                this.player.setVelocityY(0); 

                // verrouille les commandes de déplacement et valide le wall grab gauche
                this.inputsMoveLocked = true;
                this.grabLeft = true;
            }
        }

        // WALL GRAB DROIT
        else if(this.blockedRight && !this.onGround){ // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

            if (!this.cursors.up.isDown){ // si on appuie pas sur la touche de droite

                // fixe le joueur au mur
                this.player.body.setAllowGravity(false);
                this.player.setVelocityY(0);

                // verrouille les commandes de déplacement et valide le wall grab gauche
                this.inputsMoveLocked = true;
                this.grabRight = true;
            }
        }
        // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
        if((this.grabLeft || this.grabRight) && this.cursors.down.isDown){
        
            this.player.body.setAllowGravity(true);
            this.player.setVelocityY(100);
            this.inputsMoveLocked = false;
        }        
    }
}