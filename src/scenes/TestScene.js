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

        // création du player
        //this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        // création de plateforme
        //this.physics.add.collider(this.ravenPlats, this.player.projectiles, this.createPlat);

        //Création du mob
        this.mob1 = this.createMob(this.mob1, 1440, 320, layers, "right", "frog");

        //Création du mob
        this.mob2 = this.createMob(this.mob2, 1824, 320, layers, "left", "hog");

        //Création du mob
        this.mob3 = this.createMob(this.mob3, 1184, 1024, layers, "left", "raven");
           
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