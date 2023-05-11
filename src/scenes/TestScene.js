class TestScene extends Phaser.Scene {

    constructor() {
        super('TestScene');
    }

    preload() {

        // Perso test
        this.load.spritesheet('test_player', 'src/scenes/player_test.png',
            { frameWidth: 64, frameHeight: 128});

        this.load.image('tiles_test', 'src/scenes/placeholder_test.png'); //Tileset        
        
        this.load.tilemapTiledJSON('map_test', 'src/scenes/mapTest.json'); //fichier JSON

        this.spawnX = 96;
        this.spawnY = 1472;
    }

    create(){

        this.map_Test = this.add.tilemap("map_test");
        this.tileset_Test = this.map_Test.addTilesetImage('placeholder test', 'tiles_test');

        this.layer_platforms = this.map_Test.createLayer('layer_platforms', this.tileset_Test);

        this.layer_platforms.setCollisionByProperty({ estSolide: true });

        this.player_Test = this.physics.add.sprite(this.spawnX, this.spawnY, 'test_player');

        // animation joueur
        this.anims.create({
            key: 'player_idle',
            frames: [{ key: 'test_player', frame: 0 }],
        });

        this.anims.create({
            key: 'player_left',
            frames: [{ key: 'test_player', frame: 1 }],
        });

        this.anims.create({
            key: 'player_right',
            frames: [{ key: 'test_player', frame: 2 }],
        });

        // commandes
        this.cursors = this.input.keyboard.createCursorKeys();

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        this.cameras.main.setBounds(0, 0, 3072, 1728);
        this.cameras.main.setSize(3072, 1728)  ; //format 16/9

        this.speedMoveX = 300;
        this.speedMoveY = 300;

        this.physics.add.collider(this.player_Test, this.layer_platforms);

    }

    update () {

        console.log("test");

        if (this.cursors.left.isDown){ //si la touche gauche est appuyée
            this.player_Test.setVelocityX(- this.speedMoveX); //alors vitesse négative en X
            this.player_Test.anims.play('player_left', true); //animation marche gauche
        }
    
        // DEPLACEMENT - DROITE
        else if (this.cursors.right.isDown){ //sinon si la touche droite est appuyée
            this.player_Test.setVelocityX(this.speedMoveX); //alors vitesse positive en X
            this.player_Test.anims.play('player_right', true);
        }
    
        // IDLE
        else if (this.player_Test.body.onFloor()) { 
            this.player_Test.setVelocityX(0); //vitesse nulle
            this.player_Test.anims.play('player_idle'); //animation idle
        }
    
        // DEPLACEMENT - SAUT
        
        if (this.cursors.up.isDown){
            this.didPressJump = true; // autorise le jump normal
            this.player_Test.body.setVelocityY(-this.speedMoveY); // vitesseverticale négative 
    
            if(this.didPressJump == true){
                if (this.player_Test.body.onFloor()) { // possibilité de sauter seulement depuis le sol
                    
                    this.player_Test.body.setVelocityY(-this.speedMoveY); // vitesseverticale négative 
    
                    this.didPressJump = false; // bloque le jump normal (évite un double jump non autorisé, le onFloor ne suffit pas à empêcher ça)     
                }
            }
        }

    }

}