import TestScene from './scenes/TestScene.js';

const WIDTH = 3072;
const HEIGHT = 1728;
const ZOOM_FACTOR = 0; 

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
}

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  fps: {
    gravity: { y: 600 },
    target: 60,
  },
  scene: [TestScene]
}

new Phaser.Game(config);