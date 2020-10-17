import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    this.load.image('bad', 'assets/bad.png');
    this.load.image('guide-arrow', 'assets/guide-arrow.png');
    this.load.image('starfield', 'assets/starfield.png');

    this.load.atlas('mc', 'assets/mc.png', 'assets/mc.json');
    this.load.atlas('gaurd', 'assets/gaurd.png', 'assets/gaurd.json');
    this.load.atlas('arrow', 'assets/arrow.png', 'assets/arrow.json');
    this.load.atlas('kaboom', 'assets/kaboom.png', 'assets/kaboom.json');
    this.load.atlas('energy', 'assets/energy.png', 'assets/energy.json');

    this.load.audio('boom1', 'assets/boom1.mp3');
    this.load.audio('boom2', 'assets/boom2.mp3');
    this.load.audio('ding', 'assets/ding.mp3');
  }

  create() {
    this.anims.createFromAseprite('mc');
    this.anims.createFromAseprite('gaurd');
    this.anims.createFromAseprite('arrow');
    this.anims.createFromAseprite('kaboom');
    this.anims.createFromAseprite('energy');

    this.scene.start('scene-game');
  }
}

export default BootScene;