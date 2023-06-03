import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";
import Mob from "../entities/mob.js";

class Level_05 extends SceneClass {

    constructor() {
        super('Level_05');
    }

    init(data) {
        this.mapName = data.mapName;
        this.mapTileset = data.mapTileset;
        this.mapTilesetImage = data.mapTilesetImage
    };

    create() {
        this.activePossession = true;

        /*this.movingPlat1 = this.physics.add.image(1152, 864, 'movingPlat')
        .setImmovable(true)
        .setVelocity(100, 0);

        this.movingPlat1.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat1.body.velocity,
            loop: -1,
            tweens: [
                { x: +150, y: 0, duration: 2000, ease: 'Stepped' },
                { x: -150, y: 0, duration: 2000, ease: 'Stepped' },
            ]
        });

        this.movingPlat2 = this.physics.add.image(896, 1312, 'movingPlat')
            .setImmovable(true)
            //.setVelocity(100, 0);

        this.movingPlat2.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat2.body.velocity,
            loop: -1,
            tweens: [
                { x: +100, y: 0, duration: 2500, ease: 'Stepped' },
                { x: -100, y: 0, duration: 2500, ease: 'Stepped' },
            ]
        });

        this.movingPlat3 = this.physics.add.image(576, 1312, 'movingPlat')
            .setImmovable(true)
            //.setVelocity(100, 0)

        this.movingPlat3.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat3.body.velocity,
            loop: -1,
            tweens: [
            { x:    -100, y: 0, duration: 2500, ease: 'Stepped' },
            { x:    +100, y: 0, duration: 2500, ease: 'Stepped' },
            ]
        });

        this.movingPlat4 = this.physics.add.image(1184, 1632, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, 0)

        this.movingPlat4.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat4.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 5500, ease: 'Stepped' },
                { x: +150, y: 0, duration: 5500, ease: 'Stepped' },
            ]
        });*/

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        this.layers = layers;

        this.loadVar(layers);

        this.createPlayer(layers.spawnRaven.x - 64, layers.spawnRaven.y - 64, layers, "right", 'raven', false);

        // CREATION DE MOBS

        //Création du mob
        //this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", false, false);

        //Création du mob
        this.createMob(this.mob2, layers.spawnHog.x - 64, layers.spawnHog.y - 64, layers, "left", "hog", true, false);

        //Création du mob
        //this.createMob(this.mob3, layers.spawnRaven.x - 64, layers.spawnRaven.y - 64, layers, "left", "raven", true, false);
    }

    update() {
        this.updateManager()
    }
}

export default Level_05