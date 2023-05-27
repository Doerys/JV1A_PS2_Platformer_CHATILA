import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";
import Mob from "../entities/mob.js";

class Level_02 extends SceneClass {

    constructor() {
        super('Level_02');
    }

    init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
    };

    create() {

        this.controller = false;

        this.activePossession = true;
        this.playerKilled = false;

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        this.layers = layers;

        // plateforme qui bouge

        this.movingPlat1 = this.physics.add.image(1024, 513, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, 0);

        this.movingPlat1.body.setAllowGravity(false);
            
        this.tweens.timeline({
            targets: this.movingPlat1.body.velocity,
            loop: -1,
            tweens: [
            { x:    -150, y: 0, duration: 3400, ease: 'Stepped' },
            { x:    +150, y: 0, duration: 3400, ease: 'Stepped' },
            ]
        });

        this.movingPlat2 = this.physics.add.image(512, 320, 'movingPlat')
        .setImmovable(true)
        .setVelocity(100, 0);

        this.movingPlat2.body.setAllowGravity(false);
            
        this.tweens.timeline({
            targets: this.movingPlat2.body.velocity,
            loop: -1,
            tweens: [
            { x:    +150, y: 0, duration: 3400, ease: 'Stepped' },
            { x:    -150, y: 0, duration: 3400, ease: 'Stepped' },
            ]
        });

        this.movingPlat3 = this.physics.add.image(1984, 384, 'movingPlat')
        .setImmovable(true)
        //.setVelocity(100, 0)
        .setOrigin(0, 0);

        this.movingPlat3.body.setAllowGravity(false);
            
        this.physics.add.collider(layers.boxes, this.movingPlat1, this.slowBox, null, this);
        this.physics.add.collider(layers.boxes, this.movingPlat2, this.slowBox, null, this);
        this.physics.add.collider(layers.boxes, this.movingPlat3, this.slowBox, null, this);

        this.physics.add.collider(layers.bigBoxes, this.movingPlat1, this.slowBox, null, this);
        this.physics.add.collider(layers.bigBoxes, this.movingPlat2, this.slowBox, null, this);
        this.physics.add.collider(layers.bigBoxes, this.movingPlat3, this.slowBox, null, this);

        this.physics.add.collider(layers.stakes, this.movingPlat1);
        this.physics.add.collider(layers.stakes, this.movingPlat2);
        this.physics.add.collider(layers.stakes, this.movingPlat3);

        /*this.tweens.timeline({
            targets: this.movingPlat3.body.velocity,
            loop: -1,
            tweens: [
            { x:    -120, y: 0, duration: 1800, ease: 'Stepped' },
            { x:    +120, y: 0, duration: 1800, ease: 'Stepped' },
            ]
        });*/

        // création du player
        //this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        // création de plateforme
        //this.physics.add.collider(this.ravenPlats, this.player.projectiles, this.createPlat);

        this.projectilesMob = new Phaser.GameObjects.Group;

        this.projectilesPlayer = new Phaser.GameObjects.Group;

        this.playerGroup = this.physics.add.group();
        this.mobGroup = this.physics.add.group();

        this.createPlayer(layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", 'frog', false);

        //this.player = new Player (this, 0, 0, "right", "frog").disableBody(true,true);

        //this.playerGroup.add(this.player);

        //Création du mob
        //this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", false, false);

        //Création du mob
        this.createMob(this.mob2, layers.spawnHog.x, layers.spawnHog.y, layers, "left", "hog", false, false);

        //Création du mob
        //this.createMob(this.mob3, layers.spawnRaven.x, layers.spawnRaven.y, layers, "left", "raven", false, false);
           
        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });
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
}

export default Level_02