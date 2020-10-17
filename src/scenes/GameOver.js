import {Scene} from 'phaser';

class GameOver extends Scene {
  constructor() {
    super('scene-gameover');
  }

  create() {
    this.cameras.main.setBackgroundColor(0xFFFFFF);

    this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100, 'GAME OVER', {
      color: '#000'
    }).setScale(2).setOrigin(0.5);

    this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 100, 'Press anywhere\nto play again', {
      color: '#000',
      fontSize: 14,
      align: 'center'
    }).setScale(2).setOrigin(0.5);

    this.input.once('pointerup', () => {
      this.scene.start('scene-game');
    });
  }
}

export default GameOver;