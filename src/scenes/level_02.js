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
        this.activePossession = true;

        this.movingPlat1 = this.physics.add.image(1024, 544, 'movingPlat')
        .setImmovable(true)
        .setVelocity(100, 0);

        this.movingPlat1.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat1.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 3400, ease: 'Stepped' },
                { x: +150, y: 0, duration: 3400, ease: 'Stepped' },
            ]
        });

        this.movingPlat2 = this.physics.add.image(512, 352, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, 0);

        this.movingPlat2.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat2.body.velocity,
            loop: -1,
            tweens: [
                { x: +150, y: 0, duration: 3400, ease: 'Stepped' },
                { x: -150, y: 0, duration: 3400, ease: 'Stepped' },
            ]
        });

        /*this.movingPlat3 = this.physics.add.image(2016, 288, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, 0)

        this.movingPlat3.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat3.body.velocity,
            loop: -1,
            tweens: [
            { x:    -100, y: 0, duration: 1600, ease: 'Stepped' },
            { x:    +100, y: 0, duration: 1600, ease: 'Stepped' },
            ]
        });*/

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        this.layers = layers;

        this.loadVar(layers);

        this.createPlayer(layers.spawnFrog.x - 64, layers.spawnFrog.y - 64, layers, "right", 'frog', false);

        // CREATION DE MOBS

        //Création du mob
        //this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", false, false);

        //Création du mob
        this.createMob(this.mob2, layers.spawnHog.x - 64, layers.spawnHog.y - 64, layers, "left", "hog", true, false);

        //Création du mob
        //this.createMob(this.mob3, layers.spawnRaven.x, layers.spawnRaven.y, layers, "left", "raven", false, false);
    }

    update() {
        this.updateManager()
    }
}

export default Level_02