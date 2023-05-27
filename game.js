import PreloadScene from "./src/scenes/preload.js";
import TestScene from "./src/scenes/TestScene.js";
import Level_01 from "./src/scenes/level_01.js";
import Level_02 from "./src/scenes/level_02.js";

const WIDTH = 3072;
const HEIGHT = 1728;
const ZOOM_FACTOR = -3; 

const SHARED_CONFIG = {
width: WIDTH,
height: HEIGHT,
zoomFactor: ZOOM_FACTOR,
}

const Scenes = [PreloadScene, TestScene, Level_01, Level_02] // on liste les scènes
const createScene = Scene => new Scene(SHARED_CONFIG) // on crée une scène qui possède les configs
const initScenes = () => Scenes.map(createScene) // crée une scène pour chaque élément de la map. Lance la 1ere scène automatiquement

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    physics: {
    default: 'arcade',
    arcade: {
        //gravity: { y: 1450 },
        gravity: { y : 1600 },
        debug: true,
        tileBias: 64,
    }
    },
    input:{gamepad:true},
    fps: {
        target: 60,
    },
    scene: initScenes()
}

new Phaser.Game(config);