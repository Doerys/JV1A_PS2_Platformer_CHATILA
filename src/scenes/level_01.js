import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";
import Mob from "../entities/mob.js";

class Level_01 extends SceneClass {

    constructor() {
        super('Level_01');
    }

    init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
    };

    create() {

        this.controller = false;

        this.activePossession = false;
        this.playerKilled = false;

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        this.layers = layers;

        // création du player
        //this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        // création de plateforme
        //this.physics.add.collider(this.ravenPlats, this.player.projectiles, this.createPlat);

        this.projectilesMob = new Phaser.GameObjects.Group;

        this.projectilesPlayer = new Phaser.GameObjects.Group;

        this.playerGroup = this.physics.add.group();
        this.mobGroup = this.physics.add.group();

        this.player = new Player (this, 0, 0, "right", "frog").disableBody(true,true);

        this.playerGroup.add(this.player);

        //Création du mob
        this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", false, false);

        //Création du mob
        //this.createMob(this.mob2, 1824, 320, layers, "left", "hog");
        //this.createMob(this.mob2, layers.spawnHog.x, layers.spawnHog.y, layers, "left", "hog", false, false);

        //Création du mob
        //this.createMob(this.mob3, layers.spawnRaven.x, layers.spawnRaven.y, layers, "left", "raven", false, false);
           
        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        // plateforme qui bouge

        this.movingPlat = this.physics.add.image(2688, 512, 'movingPlat')
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

export default Level_01