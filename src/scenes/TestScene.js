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

        this.activePossession = false;

        // plateforme qui bouge

        this.movingPlat1 = this.physics.add.image(1408, 1536, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, 0);

        this.movingPlat1.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat1.body.velocity,
            loop: -1,
            tweens: [
                { x: -200, y: 0, duration: 1000, ease: 'Stepped' },
                { x: +200, y: 0, duration: 1000, ease: 'Stepped' },
            ]
        });

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        this.layers = layers;

        this.loadVar(layers);

        this.movingPlat2;

        this.player = new Player(this, 0, 0, "right", "frog", false).disableBody(true, true);

        this.playerGroup.add(this.player);

        //Création du mob
        this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", false, false);

        //Création du mob
        //this.createMob(this.mob2, 1824, 320, layers, "left", "hog");
        this.createMob(this.mob2, layers.spawnHog.x, layers.spawnHog.y, layers, "left", "hog", false, false);

        //Création du mob
        this.createMob(this.mob3, layers.spawnRaven.x, layers.spawnRaven.y, layers, "left", "raven", false, false);
    }

    update() {
        this.updateManager()
    }
}

export default TestScene