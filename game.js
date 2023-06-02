import PreloadScene from "./src/scenes/preload.js";
import TestScene from "./src/scenes/TestScene.js";
import Level_01 from "./src/scenes/level_01.js";
import Level_02 from "./src/scenes/level_02.js";
import Level_03 from "./src/scenes/level_03.js";
import Level_04 from "./src/scenes/level_04.js";

const WIDTH = 3072;
const HEIGHT = 1728;
const ZOOM_FACTOR = -3;

// FINALEMENT INUTILE
const SHARED_CONFIG = {
    mode: Phaser.Scale.FIT,
    width: WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
}

const Scenes = [PreloadScene, TestScene, Level_01, Level_02, Level_03, Level_04] // on liste les scènes
const createScene = Scene => new Scene(SHARED_CONFIG) // on crée une scène qui possède les configs
const initScenes = () => Scenes.map(createScene) // crée une scène pour chaque élément de la map. Lance la 1ere scène automatiquement

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 3072,
        height: 1728
    },
    scene: initScenes()
}

new Phaser.Game(config);