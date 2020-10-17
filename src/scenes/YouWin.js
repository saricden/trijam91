import {Scene} from 'phaser';

class YouWin extends Scene {
  constructor() {
    super('scene-youwin');
  }

  create() {
    this.cameras.main.setBackgroundColor(0xFFFFFF);

    this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100, 'YOU WIN', {
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

export default YouWin;