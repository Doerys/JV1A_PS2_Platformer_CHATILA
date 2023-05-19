import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";
import Projectile from "../entities/projectile.js";

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

        this.spawnX = 96;
        this.spawnY = 1472;

        this.controller = false;

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        // création du player
        this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        /*this.mob = this.add.sprite(this.spawn.x +32, this.spawn.y, 'mob')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', function (){
        
            this.possessMob(this.mob, this.mob.x, this.mob.y, layers);

        }, this)*/

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        // PLAYER - Collision entre le joueur et les limites du niveau

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728).setSize(3072, 1728); //format 16/9 

        // éléments de décors
        this.breaks = this.physics.add.staticGroup();
        this.boxes = this.physics.add.group();
        this.ravenPlats = this.physics.add.staticGroup();

        layers.layer_break.objects.forEach(break_create => {
            const breaks = this.breaks.create(break_create.x + 32, break_create.y + 32, "break");
            
            // si collision pendant charge, détruit l'objet et stop la charge
            this.physics.add.collider(this.player, breaks, function () {
                if (this.player.isCharging && (this.player.body.touching.left || this.player.body.touching.right)) {
                    breaks.destroy(); this.player.stopCharge()
                }
            }, null, this);
        }, this)

        layers.layer_box.objects.forEach(box => {
            const boxes = this.boxes.create(box.x + 32, box.y + 32, "box").setDamping(true);
            this.physics.add.collider(boxes, layers.layer_platforms, this.disablePushPlayer, null, this);

            this.physics.add.collider(boxes, this.player);
        }, this)

        layers.layer_ravenPlat.objects.forEach(ravenPlat => {
            const ravenPlateform = this.ravenPlats.create(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOff");
            
            // si collision pendant charge, détruit l'objet et stop la charge
            this.physics.add.collider(this.player.projectiles, ravenPlateform, this.player.projectiles.createPlat(), null, this);

        }, this)
           
        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });
    }

    update() { }

    disablePushPlayer(box) {
        if(box.body.blocked.down){
            if (box.body.blocked.right || box.body.blocked.left) {
                console.log("CHECK");
                box.body.setImmovable(true);
                box.setVelocity(0, 0);
            }
        box.setDragX(0.0001);
        }
    }
}

export default TestScene