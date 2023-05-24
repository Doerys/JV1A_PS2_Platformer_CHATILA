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

        this.mobs = this.createMob(layers.layer_spawn, layers.layer_platforms);

        // création du player
        //this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        // création de plateforme
        //this.physics.add.collider(this.ravenPlats, this.player.projectiles, this.createPlat);

        //const mobs = this.physics.add.group();

        this.player = new Player(this, 0, 0, "right", "frog").disableBody(true, true);
/*
        this.mobs.on('pointerdown', function () {
            console.log("check")
            this.mobs.disableIA(); // désactive le update du mob pour éviter un crash

            if (this.activePossession) { // si on contrôlait déjà un mob, on remplace notre ancien corps "player" par un mob 
                this.replacePlayer(this.player, layers, this.possessedMob.sprite, currentFacing, this.possessedMob.nature);
            }
            // possession du mob
            this.possessedMob = this.possessMob(mob, mob.x, mob.y, layers, currentFacing, currentMob, player);
        }, this)
*/
        /*
        //Création du mob
        this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", this.player);

        //Création du mob
        //this.createMob(this.mob2, 1824, 320, layers, "left", "hog");
        this.createMob(this.mob2, layers.spawnHog.x, layers.spawnHog.y, layers, "left", "hog", this.player);

        //Création du mob
        this.createMob(this.mob3, layers.spawnRaven.x, layers.spawnRaven.y, layers, "left", "raven", this.player);
        */
        //this.addMobsCollisions(mobs, layers);

        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        this.boxTest = this.physics.add.image(1984 + 32, 1600 + 32, 'box');

        this.boxTest.body.setAllowGravity(false).setImmovable(true);

        this.physics.add.collider(this.boxTest, layers.layer_platforms);

        // plateforme qui bouge

        this.movingPlat = this.physics.add.image(1408, 1536, 'movingPlat')
            .setImmovable(true)
        //.setVelocity(100, 0);

        this.movingPlat.body.setAllowGravity(false);

        /*this.tweens.timeline({
            targets: this.movingPlat.body.velocity,
            loop: -1,
            tweens: [
            { x:    -200, y: 0, duration: 1000, ease: 'Stepped' },
            { x:    +200, y: 0, duration: 1000, ease: 'Stepped' },
            ]
        });*/
    }

    update() {
        if (this.switchRavenPlatOn) {
            this.ravenPlatOn.enableBody();
        }
    }

    onProjectileCollision(enemy, projectile) {
        //enemy.getHit(projectile); 
        //projectile.hit(enemy);
        enemy.destroy();
        projectile.destroy();
    }
}

export default TestScene