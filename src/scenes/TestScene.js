import SceneClass from "../templates/sceneClass.js";
import Player from "../entities/player.js";

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
        this.switchRavenPlatOn = false;

        this.controller = false;

        // load de la map
        const levelMap = this.add.tilemap(this.mapName);

        // chargement des calques
        const layers = this.loadMap(levelMap);

        // création du player
        this.createPlayer(layers.spawnPoint.x, layers.spawnPoint.y, layers);

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 3072, 1728);
        // PLAYER - Collision entre le joueur et les limites du niveau

        // caméra
        this.cameras.main.setBounds(0, 0, 3072, 1728).setSize(3072, 1728); //format 16/9 

        // éléments de décors
        this.breaks = this.physics.add.staticGroup();
        this.boxes = this.physics.add.group();
        this.ravenPlats = this.physics.add.staticGroup();

        // création des éléments destructibles (charge)
        layers.layer_break.objects.forEach(break_create => {
            const breaks = this.breaks.create(break_create.x + 32, break_create.y + 32, "break");
            
            // si collision pendant charge, détruit l'objet et stop la charge
            this.physics.add.collider(this.player, breaks, function () {
                if (this.player.isCharging && (this.player.body.touching.left || this.player.body.touching.right)) {
                    breaks.destroy(); this.player.stopCharge()
                }
            }, null, this);
        }, this)

        // création des box poussables
        layers.layer_box.objects.forEach(box => {
            const boxes = this.boxes.create(box.x + 32, box.y + 32, "box").setDamping(true);
            this.physics.add.collider(boxes, layers.layer_platforms, this.disablePushPlayer, null, this);

            this.physics.add.collider(boxes, this.player);
        }, this)

        // création des plateformes qu'on peut créer en tirant dessus
        /*layers.layer_ravenPlat.objects.forEach(ravenPlat => {
            const ravenPlateform = this.ravenPlats.create(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOff");
            this.ravenPlatOn = this.physics.add.staticSprite(ravenPlat.x + 32, ravenPlat.y + 32, "ravenPlatOn").disableBody(true, true);
        
            this.physics.add.collider(this.ravenPlatOn, this.player);
        }, this)*/

        // création du mob
        this.mob = this.physics.add.group();       
        
        this.mob.create(600, 1524, 'mob')        
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', function (){
        
            this.possessMob(this.mob, this.mob.x, this.mob.y, layers);

        }, this)

        // colliders avec le mob
        this.physics.add.collider(this.mob, this.player);
        this.physics.add.collider(this.mob, layers.layer_platforms);
        
        this.physics.add.collider(this.mob, this.player.projectiles, this.onProjectileCollision);

        // création de plateforme
        //this.physics.add.collider(this.ravenPlats, this.player.projectiles, this.createPlat);
           
        // implémentation pour contrôle à la manette
        this.input.gamepad.once('connected', function (pad) {
            controller = pad;
        });

        this.movingPlat = this.physics.add.image(1408, 1536, 'movingPlat')
            .setImmovable(true)
            .setVelocity(100, -100);

        this.movingPlat.body.setAllowGravity(false);
            
        this.tweens.timeline({
            targets: this.movingPlat.body.velocity,
            loop: -1,
            tweens: [
            { x:    -200, y: 0, duration: 1000, ease: 'Stepped' },
            { x:    +200, y: 0, duration: 1000, ease: 'Stepped' },
            ]
        });

        this.physics.add.collider(this.player, this.movingPlat);
        
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