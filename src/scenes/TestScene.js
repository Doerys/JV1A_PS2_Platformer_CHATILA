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
        
        this.accelerationX = 50;
        this.frictionGround = 50; 
        
        this.canJump = true;
        this.isJumping = false;
        
        this.physics.add.collider(this.player, this.layer_platforms);

    }

    update () {
        // ANIMATIONS - DEPLACEMENT 2 DIRECTIONS
        this.player.setVelocityX(this.speedMoveX); // a chaque frame, applique la vitesse déterminée en temps réelle par d'autres fonctions.

        if (this.player.body.blocked.right || this.player.body.blocked.left) { // STOP la vitesse du joueur d'un coup s'il entre en contact avec un mur
            this.speedMoveX = 0;
        }

        if (this.speedMoveX == 0) { // condition pour idle
            if (this.facingPlayer == 'right') {
                this.player.anims.play('player_right', true);
            }
            if (this.facingPlayer == 'left') {
                this.player.anims.play('player_left', true);
            }
        }
        
        // DEPLACEMENT 2 DIRECTIONS

        // DEPLACEMENT A GAUCHE
        if ((this.cursors.left.isDown || this.keyQ.isDown || this.controller.left)) { // si touche vers la gauche pressée
            this.player.anims.play('player_left', true);
            this.facingPlayer = 'left';

            if (Math.abs(this.speedMoveX) < this.speedXMax) {
                this.speedMoveX -= this.accelerationX;
            }
            else {
                this.speedMoveX = -this.speedXMax;
            }
        }

        // DEPLACEMENT A DROITE
        else if ((this.cursors.right.isDown || this.keyD.isDown || this.controller.right)) { // si touche vers la droite pressée
            this.player.anims.play('player_right', true);
            this.facingPlayer = 'right';

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

        this.onGround = this.player.body.blocked.down;
        this.upOnce = Phaser.Input.Keyboard.JustDown(this.cursors.up);

        // handle long jump press
        if ((this.upOnce) && this.canJump && this.onGround){
            this.jumpTimer = 1;
            this.canJump = false;
            this.isJumping = true;
            this.player.setVelocityY(-this.speedMoveX);

            setTimeout(() => {
                this.canJump = true;
            }, 100);
        } else if ((this.cursors.up.isDown) && this.jumpTimer != 0){
            if (this.jumpTimer > 12) {
                this.jumpTimer = 0;
            } else {
                // jump higher if holding jump
                this.jumpTimer++;
                this.player.setVelocityY(-this.speedMoveY);
            }
        } else if (this.jumpTimer != 0){
            this.jumpTimer = 0;
        }
    }
}