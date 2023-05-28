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

        this.loadVar();

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        this.layers = layers;

        // plateforme qui bouge

        /*layers.layer_movingPlats.objects.forEach(movingPlat => {
            let movingPlat1 = null;
            let movingPlat2 = null;
            let movingPlat3 = null;
            let movingPlat4 = null;

            if (movingPlat.type == "1") {
                movingPlat1 = this.physics.add.image(movingPlat.x, movingPlat.y, 'movingPlat')
                    .setImmovable(true)
                    .setVelocity(100, 0);

                movingPlat1.body.setAllowGravity(false);

                tweens.timeline({
                    targets: movingPlat1.body.velocity,
                    loop: -1,
                    tweens: [
                        { x: -150, y: 0, duration: 3400, ease: 'Stepped' },
                        { x: +150, y: 0, duration: 3400, ease: 'Stepped' },
                    ]
                });
            }
        }, this)*/

        this.movingPlat1 = this.physics.add.image(1024, 513, 'movingPlat')
        //.setImmovable(true)
        //.setVelocity(100, 0);

        //this.movingPlat1.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: this.movingPlat1.body.velocity,
            loop: -1,
            tweens: [
                { x: -150, y: 0, duration: 3400, ease: 'Stepped' },
                { x: +150, y: 0, duration: 3400, ease: 'Stepped' },
            ]
        });

        //layers.movingPlats.add(this.movingPlat1);

        this.movingPlat2 = this.physics.add.image(512, 320, 'movingPlat')
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

        this.movingPlats.add(this.movingPlat2);



        this.movingPlat3 = this.physics.add.image(1984, 384, 'movingPlat')
            .setImmovable(true)
            //.setVelocity(100, 0)
            .setOrigin(0, 0);

        this.movingPlat3.body.setAllowGravity(false);

        /*this.tweens.timeline({
            targets: this.movingPlat3.body.velocity,
            loop: -1,
            tweens: [
            { x:    -120, y: 0, duration: 1800, ease: 'Stepped' },
            { x:    +120, y: 0, duration: 1800, ease: 'Stepped' },
            ]
        });*/

        /*this.physics.add.collider(layers.boxes, this.movingPlat1, this.slowBox, null, this);
        this.physics.add.collider(layers.boxes, this.movingPlat2, this.slowBox, null, this);
        this.physics.add.collider(layers.boxes, this.movingPlat3, this.slowBox, null, this);

        this.physics.add.collider(layers.bigBoxes, this.movingPlat1, this.slowBox, null, this);
        this.physics.add.collider(layers.bigBoxes, this.movingPlat2, this.slowBox, null, this);
        this.physics.add.collider(layers.bigBoxes, this.movingPlat3, this.slowBox, null, this);

        this.physics.add.collider(layers.stakes, this.movingPlat1);
        this.physics.add.collider(layers.stakes, this.movingPlat2);
        this.physics.add.collider(layers.stakes, this.movingPlat3);*/

        this.createPlayer(layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", 'frog', false);


        // CREATION DE MOBS

        //Création du mob
        //this.createMob(this.mob1, layers.spawnFrog.x, layers.spawnFrog.y, layers, "right", "frog", false, false);

        //Création du mob
        this.createMob(this.mob2, layers.spawnHog.x, layers.spawnHog.y, layers, "left", "hog", false, false);

        //Création du mob
        //this.createMob(this.mob3, layers.spawnRaven.x, layers.spawnRaven.y, layers, "left", "raven", false, false);
    }

    update() {
        if (this.switchRavenPlatOn) {
            this.ravenPlatOn.enableBody();
        }
    }
}

export default Level_02