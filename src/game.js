import './main.css';
import Phaser, {Game} from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import GameOver from './scenes/GameOver';
import YouWin from './scenes/YouWin';

const canvas = document.getElementById('game-canvas');
const config = {
  type: Phaser.WEB_GL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  scene: [
    BootScene,
    GameScene,
    GameOver,
    YouWin
  ]
};

const game = new Game(config);