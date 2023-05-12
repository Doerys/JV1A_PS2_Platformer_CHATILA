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

        this.map_Test = this.add.tilemap("map_test");
        this.tileset_Test = this.map_Test.addTilesetImage('placeholder_test', 'tiles_test');

        this.layer_platforms = this.map_Test.createLayer('layer_platforms', this.tileset_Test);

        this.layer_platforms.setCollisionByProperty({ estSolide: true });

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

        this.cameras.main.setBounds(0, 0, 3072, 1728);
        this.cameras.main.setSize(3072, 1728)  ; //format 16/9

        this.speedMoveX = 0;
        this.speedXMax = 145;
        this.speedMoveY = 600;
        //this.speedMoveY = 1000;

        this.canJump = true;
        this.isJumping = false;
        
        this.accelerationX = 15;
        this.frictionGround = 15; 
        
        this.canJump = true;
        this.isJumping = false;
        this.inputsMoveLocked = false;
        
        this.physics.add.collider(this.player, this.layer_platforms);

    }

    update () {
        // ANIMATIONS - DEPLACEMENT 2 DIRECTIONS
        this.player.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

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

        // DEPLACEMENT A GAUCHE
        if ((this.cursors.left.isDown || this.keyQ.isDown || this.controller.left) && this.inputsMoveLocked == false) { // si touche vers la gauche pressée
            this.player.anims.play('player_left', true);
            this.playerFacing = 'left';

            if (Math.abs(this.speedMoveX) < this.speedXMax) {
                this.speedMoveX -= this.accelerationX;
            }
            else {
                this.speedMoveX = -this.speedXMax;
            }
        }

        // DEPLACEMENT A DROITE
        else if ((this.cursors.right.isDown || this.keyD.isDown || this.controller.right) && this.inputsMoveLocked == false) { // si touche vers la droite pressée
            this.player.anims.play('player_right', true);
            this.playerFacing = 'right';

            if (Math.abs(this.speedMoveX) < this.speedXMax) {
                this.speedMoveX += this.accelerationX;
            }
            else {
                this.speedMoveX = this.speedXMax;
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

        /*
        // Mécanique de saut
        if (this.player.body.blocked.down && (this.cursors.up.isDown || this.spaceBar.isDown || this.controller.A)) {
            console.log("Check");
            this.player.setVelocityY(- this.speedMoveY);

            if (Math.abs(this.speedMoveY) < this.speedYMax) {
                this.speedMoveY += this.accelerationY;
            }
            else {
                this.speedMoveY = this.speedYMax;
            }
        }*/

        this.onGround = this.player.body.blocked.down; // verifie que le joueur est au sol
		this.blockedLeft = this.player.body.blocked.left;
		this.blockedRight = this.player.body.blocked.right;

        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up); // variable correspondant à une pression instantanée

        // handle long jump press
        if (this.upOnce && this.canJump && this.onGround){ // si on vient de presser saut + peut sauter true + au sol
            this.jumpTimer = 1; // création jump timer
            this.canJump = false; // ne peut plus sauter - FALSE
            this.isJumping = true; // est en train de sauter - TRUE
            this.player.setVelocityY(-this.speedMoveX); // On set la vélocité Y à la force de base

            setTimeout(() => {
                this.canJump = true;
            }, 100); // après un certain temps, on repasse la possibilité de sauter à true

        } else if (this.cursors.up.isDown && this.jumpTimer != 0){ // si le curseur haut est pressé et jump timer =/= 0
            if (this.jumpTimer > 24) { // Si le timer du jump est supérieur à 12, le stoppe.
                this.jumpTimer = 0;
            } else {
                // jump higher if holding jump
                this.jumpTimer++; // on imcrémente au fur et à mesure
                this.player.setVelocityY(-this.speedMoveY);
            }
        } else if (this.jumpTimer != 0){
            this.jumpTimer = 0;
        }
        
        console.log(this.blockedLeft);


        // handle walljumps

        // WALL JUMP GAUCHE
        if(this.blockedLeft && !this.onGround){

            if (!this.cursors.up.isDown){

                this.player.body.setAllowGravity(false);
                this.player.setVelocityY(0);
                //this.player.setImmovable(true)
                this.inputsMoveLocked = true;
                this.grabLeft = true;
            }
        }

        else if(this.blockedRight && !this.onGround){

            if (!this.cursors.up.isDown){

                this.player.body.setAllowGravity(false);
                this.player.setVelocityY(0);
                //this.player.setImmovable(true)
                this.inputsMoveLocked = true;
                this.grabRight = true;
            }
        }

        if(this.grabLeft && this.upOnce){
        
            this.player.body.setAllowGravity(true);
            this.inputsMoveLocked = false;

            this.jumpTimer = 1; // création jump timer
            this.canJump = false; // ne peut plus sauter - FALSE
            this.isJumping = true; // est en train de sauter - TRUE
            this.player.setVelocityY(-this.speedMoveX); // On set la vélocité Y à la force de base

            setTimeout(() => {
                this.canJump = true;
            }, 100); // après un certain temps, on repasse la possibilité de sauter à true
    
        } else if (this.cursors.up.isDown && this.jumpTimer != 0){ // si le curseur haut est pressé et jump timer =/= 0
            if (this.jumpTimer > 24) { // Si le timer du jump est supérieur à 12, le stoppe.
                this.jumpTimer = 0;
            } else {
                // jump higher if holding jump
                this.jumpTimer++; // on imcrémente au fur et à mesure
                this.player.setVelocityY(-this.speedMoveY);
            }
        } else if (this.jumpTimer != 0){
            this.jumpTimer = 0;
        }
            
            /*if ((cursors.up.isDown || spaceBar.isDown || controller.up || controller.A) && (wallIce == false)){ // SAUT => on se repousse du mur
                // commandes bloquées
                commandesLocked = true;

                player.setAccelerationX(0); // reset l'accélération à 0
                
                player.setAccelerationX(4000);
                player.setMaxVelocity(1000);
                player.setVelocityY(-speedMoveY);
                                
                // commandes débloquées
                setTimeout(function() {
                    unlockCommandes();
                    player.setAccelerationX(0);                
                }, 2000);
            }*/
        


        /*if (this.blockedRight){
            
            this.jumpTimer = 1;
            this.canJump = false;
            this.isJumping = true;

            this.player.setAccelerationX(- this.accelerationX);
            this.player.setMaxVelocity(this.speedXMax, this.speedYMax);
            this.player.setVelocity(-this.speedMoveX, -this.speedMoveY);

            // slow down after wall jumping
            setTimeout(() => { 
                this.canJump = true;
                this.player.setMaxVelocity(this.speedMoveX / 1.2, this.speedMoveY / 1.2);
            }, 100);
            setTimeout(() => { 
                this.player.setMaxVelocity(this.speedMoveX / 1.5, this.speedMoveY);
            }, 200);
            setTimeout(() => {
                this.player.setMaxVelocity(this.speedMoveX, this.speedMoveY);
            }, 300);

        } else if (this.blockedLeft){
                            
            this.jumpTimer = 1;
            this.canJump = false;
            this.isJumping = true;

            this.player.setAccelerationX(this.accelerationX);
            this.player.setMaxVelocity(this.speedXMax, this.speedYMax);
            this.player.setVelocity(this.speedMoveX, -this.speedMoveY);

            // slow down after wall jumping
            setTimeout(() => { 
                this.canJump = true;
                this.player.setMaxVelocity(this.speedMoveX / 1.2, this.speedMoveY / 1.2);
            }, 100);
            setTimeout(() => { 
                this.player.setMaxVelocity(this.speedMoveX / 1.5, this.speedMoveY);
            }, 200);
            setTimeout(() => {
                this.player.setMaxVelocity(this.speedMoveX, this.speedMoveY);
            }, 300);
        }*/
        
    }
    

}