import PreloadScene from "./src/scenes/preload.js";
import TestScene from "./src/scenes/TestScene.js";

const WIDTH = 3072;
const HEIGHT = 1728;
const ZOOM_FACTOR = -3; 

const SHARED_CONFIG = {
width: WIDTH,
height: HEIGHT,
zoomFactor: ZOOM_FACTOR,
}

const Scenes = [PreloadScene, TestScene]
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

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
    scene: initScene()
}

new Phaser.Game(config);