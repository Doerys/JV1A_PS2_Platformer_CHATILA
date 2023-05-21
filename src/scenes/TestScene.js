import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";
import Mob from "../entities/mob.js";

class TestScene extends SceneClass {

    constructor() {
        super('TestScene');
    }

    init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
    };

    create() {

        this.controller = false;

        this.activePossession = false;

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        //this.player = this.physics.add.sprite(5000, 5000);

        // création du player
        //this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        // création des plateformes qu'on peut créer en tirant dessus
        /*layers.layer_ravenPlat.objects.forEach(ravenPlat => {
            const ravenPlateform = this.ravenPlats.create(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOff");
            this.ravenPlatOn = this.physics.add.staticSprite(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOn").disableBody(true, true);
        
            this.physics.add.collider(this.ravenPlatOn, this.player);
        }, this)*/

        // création du mob
        /*this.mob = this.physics.add.group();
        
        this.mob.create(600, 1524, 'mob')        
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', function (){
        
            this.possessMob(this.mob, this.mob.x, this.mob.y, layers);

        }, this)

        // colliders avec le mob
        this.physics.add.collider(this.mob, this.player);
        this.physics.add.collider(this.mob, layers.layer_platforms);
        
        this.physics.add.collider(this.mob, this.player.projectiles, this.onProjectileCollision);*/

        //Création du mob
        this.mob1 = this.createMob(this.mob1, 1440, 320, layers, "right", "frog");

        //Création du mob
        this.mob2 = this.createMob(this.mob2, 1824, 320, layers, "left", "hog");

        //Création du mob
        this.mob3 = this.createMob(this.mob3, 2208, 320, layers, "left", "raven");

        // création de plateforme
        //this.physics.add.collider(this.ravenPlats, this.player.projectiles, this.createPlat);
           
        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        // plateforme qui bouge

        this.movingPlat = this.physics.add.image(1408, 1536, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, 0);

        this.movingPlat.body.setAllowGravity(false);
            
        this.tweens.timeline({
            targets: this.movingPlat.body.velocity,
            loop: -1,
            tweens: [
            { x:    -200, y: 0, duration: 1000, ease: 'Stepped' },
            { x:    +200, y: 0, duration: 1000, ease: 'Stepped' },
            ]
        });

        //this.physics.add.collider(this.player, this.movingPlat);
    }

    update() { 
        if(this.switchRavenPlatOn){
            this.ravenPlatOn.enableBody();
        }
    }

    onProjectileCollision(enemy, projectile){
        //enemy.getHit(projectile); 
        //projectile.hit(enemy);
        enemy.destroy();
        projectile.destroy(); 
    }
    /*
    createPlat(plat, proj){
        plat.destroy();
        proj.destroy(); 
        this.switchRavenPlatOn = true;
    }*/
}

export default TestScene