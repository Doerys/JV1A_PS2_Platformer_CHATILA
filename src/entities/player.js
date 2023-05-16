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

        this.facing = 'right';

        this.canJump = true;
        
        this.jumpCounter = 1;
        this.isJumping = false;
        
        this.accelerationX = 15;
        this.frictionGround = 15; 
    
        this.inputsMoveLocked = false;
    }

    preload() {

        this.spawnX = 96;
        this.spawnY = 1472;
    }

    create(){

        // commandes
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

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

    update () {
        
        this.onGround = this.body.blocked.down; // verifie que le joueur est au sol
		this.blockedLeft = this.body.blocked.left; // verifie si le joueur est contre une paroi gauche
		this.blockedRight = this.body.blocked.right; // verifie si le joueur est contre une paroi droite

        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up); // variable correspondant à une pression instantanée du jump

        if (this.onGround){
            this.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.
            this.inputsMoveLocked = false;
            this.jumpCounter = 1; // si le joueur est au sol, réinitialise son compteur de jump
        }

        // ANIMATIONS - DEPLACEMENT 2 DIRECTIONS
        if (this.body.blocked.right || this.body.blocked.left) { // STOP la vitesse du joueur d'un coup s'il entre en contact avec un mur
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
            && !this.controller.right && (this.onGround || this.player.body.velocity.y == 0) && this.speedPlayer != 0) { // si aucune touche de déplacement pressée + bloqué au sol + pas de saut + pas déjà immobile

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

        // SAUT (plus on appuie, plus on saut haut)
        
        // déclencheur du saut
        if (this.upOnce && this.canJump && this.jumpCounter > 0 && this.onGround){ // si on vient de presser saut + peut sauter true + au sol
            this.jumpTimer = 1; // création jump timer
            this.canJump = false; // ne peut plus sauter - FALSE
            this.jumpCounter -= 1;
            this.isJumping = true; // est en train de sauter - TRUE
            this.setVelocityY(-this.speedMoveY); // On set la vélocité Y à la force de base

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
            if (this.jumpTimer > 24 || this.body.blocked.up) { // Si le timer du jump est supérieur à 12, le stoppe.
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

                this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabLeft = false; // désactive la variable du wallGrab
 
                this.setVelocityX(this.speedXMax); // repousse sur la gauche
                this.setVelocityY(-this.speedMoveY); // pulsion vers le haut

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
    
                this.body.setAllowGravity(true); // réactive la gravité du joueur fixé au mur
                this.grabRight = false; // désactive la variable du wallGrab

                this.setVelocityX(- this.speedXMax); // repousse sur la gauche
                this.setVelocityY(- this.speedMoveY); // pulsion vers le haut

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
                this.body.setAllowGravity(false);
                this.setVelocityY(0); 

                // verrouille les commandes de déplacement et valide le wall grab gauche
                this.inputsMoveLocked = true;
                this.grabLeft = true;
            }
        }

        // WALL GRAB DROIT
        else if(this.blockedRight && !this.onGround){ // si on est bloqué sur une paroi de droite, et pas en contact avec le sol

            if (!this.cursors.up.isDown){ // si on appuie pas sur la touche de droite

                // fixe le joueur au mur
                this.body.setAllowGravity(false);
                this.setVelocityY(0);

                // verrouille les commandes de déplacement et valide le wall grab gauche
                this.inputsMoveLocked = true;
                this.grabRight = true;
            }
        }
        // permet de désactiver le wall jump pour descendre, en pressant la touche du bas
        if((this.grabLeft || this.grabRight) && this.cursors.down.isDown){
        
            this.body.setAllowGravity(true);
            this.setVelocityY(100);
            this.inputsMoveLocked = false;
        }        
    }
    
    handleBoxCollision(player, box){

        console.log(this.player);

        if(this.blockedRight){
            this.futureX = this.box.x + (-1) * 64
        }
        else if(this.blockedLeft){
            this.futureX = this.box.x + 1 * 64
        }

        // Vérifie si la position future de la caisse est valide (ne rentre pas en collision avec la plateforme)
        if (!this.layer_platforms.getTileAtWorldXY(this.futureX, this.box.y)) {
            // Déplace la caisse dans la direction déterminée
            this.box.x = this.futureX;

            // Déplace le joueur pour éviter le chevauchement
            if(this.body.blocked.right){
                this.player.x += -1 * 64; // Déplace le joueur de la même distance que la caisse
            }
            else if(this.body.blocked.left){
                this.player.x += 1 * 64; // Déplace le joueur de la même distance que la caisse
            }
        }
    }


    pushBox(player, box){
        player.body.velocity.x = this.speedXMax - this.speedXMax - .25
        box.body.velocity.x = player.body.velocity.x

        if(player.body.blocked.right){
            
        }
            
        player.body.velocity.x = this.speedXMax - this.speedXMax - .25
        box.body.velocity.x = player.body.velocity.x

    }
}

export default Player