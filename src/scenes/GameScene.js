import {Scene, Math as pMath} from 'phaser';
import Guard from '../sprites/Guard';
import Bad from '../sprites/Bad';

const {Vector2} = pMath;

class GameScene extends Scene {

  constructor() {
    super("scene-game");
  }

  create() {

    this.starfield1 = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'starfield');
    this.starfield1.setScale(2);
    this.starfield1.setScrollFactor(0);

    this.starfield2 = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'starfield');
    this.starfield2.setScale(2);
    this.starfield2.setScrollFactor(0);

    this.starfield3 = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'starfield');
    this.starfield3.setScale(2);
    this.starfield3.setScrollFactor(0);

    this.mc = this.physics.add.sprite(10, 10, 'mc');
    this.mc.setScale(2);

    this.mc.play({ key: 'fly', repeat: -1 });

    this.mc.isDead = false;

    this.mcTarget = new Vector2();

    this.guards = [];

    for (let i = 0; i < 5; i++) {
      const guard = new Guard({
        scene: this,
        x: this.mc.x,
        y: this.mc.y
      });

      this.guards = [
        ...this.guards,
        guard
      ];
    }

    this.arrow = this.physics.add.sprite(0, 0, 'arrow');
    this.arrow.setScale(2);
    this.arrow.setOrigin(0.5, 1);
    this.arrow.setVisible(false);

    this.arrow.play({ key: 'arrow-osc', repeat: -1 });

    this.guideArrow = this.add.sprite(this.mc.x, this.mc.y, 'guide-arrow');
    this.guideArrow.setScale(2);

    this.fadeGFX = this.add.graphics();
    this.fadeGFX.fillStyle(0xFFFFFF);
    this.fadeGFX.setScrollFactor(0);
    this.fadeGFX.setDepth(100);
    this.fadeGFX.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.fadeGFX.setAlpha(0);

    // Bad guys
    this.bads = [];

    for (let i = 0; i < 40; i++) {
      const bad = new Bad({
        scene: this,
        x: pMath.Between(-2000, 2000),
        y: pMath.Between(-2000, 2000)
      });

      this.bads = [
        ...this.bads,
        bad
      ];
    }

    this.energies = [];

    for (let i = 0; i < 5; i++) {
      const energy = this.physics.add.sprite(pMath.Between(-2000, 2000), pMath.Between(-2000, 2000), 'energy');
      energy.play({ key: 'pulse', repeat: -1 });
      energy.setScale(2);
      energy.isCollected = false;

      this.physics.add.overlap(energy, this.mc, this.collectEnergy, null, this);

      this.energies = [
        ...this.energies,
        energy
      ];
    }

    this.score = 0;
    this.hasWon = false;
    this.hasLost = false;

    this.prevX = 0;
    this.prevY = 0;

    this.scoreText = this.add.text(window.innerWidth / 2, 10, `${this.score} / 5`, {
      color: '#FFF',
      fontSize: 20
    });
    this.scoreText.setOrigin(0.5, 0);
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(99);
    
    this.input.on('pointerup', (pointer) => {
      if (!this.mc.isDead) {
        const {worldX, worldY} = pointer;

        this.mcTarget.x = worldX;
        this.mcTarget.y = worldY;

        this.arrow.body.reset(worldX, worldY);
        this.arrow.setVisible(true);

        const angle = pMath.Angle.Between(this.mc.x, this.mc.y, worldX, worldY);

        this.mc.setRotation(angle + (Math.PI / 2));
        
        this.physics.moveToObject(this.mc, this.mcTarget, 200);
      }
    }, this);

    this.cameras.main.startFollow(this.mc);
  }

  collectEnergy(energy, mc) {
    if (!energy.isCollected) {
      this.sound.play('ding');
      energy.isCollected = true;
      energy.setVisible(false);
      energy.setActive(false);
      this.score++;
      this.scoreText.setText(`${this.score} / 5`);
      if (this.score === 5) {
        this.win();
      }
    }
  }

  gameOver() {
    this.hasLost = true;

    this.tweens.add({
      targets: this.fadeGFX,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.scene.start('scene-gameover');
      }
    })
  }

  win() {
    this.tweens.add({
      targets: this.fadeGFX,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.scene.start('scene-youwin');
      }
    })
  }

  update() {
    let d2ne = null;
    let nearestEnergy = null;
    for (let e in this.energies) {
      if (!this.energies[e].isCollected) {
        const d2e = pMath.Distance.Between(this.mc.x, this.mc.y, this.energies[e].x, this.energies[e].y);

        if (d2ne === null || d2e < d2ne) {
          d2ne = d2e;
          nearestEnergy = this.energies[e];
        }
      }
    }

    const xDiff = this.prevX - this.mc.x;
    const yDiff = this.prevY - this.mc.y;

    this.starfield1.tilePositionX -= (xDiff / 4);
    this.starfield1.tilePositionY -= (yDiff / 4);
    this.starfield2.tilePositionX -= (xDiff / 6);
    this.starfield2.tilePositionY -= (yDiff / 6);
    this.starfield3.tilePositionX -= (xDiff / 2);
    this.starfield3.tilePositionY -= (yDiff / 2);

    this.prevX = this.mc.x;
    this.prevY = this.mc.y;

    if (nearestEnergy !== null) {
      const angleToNearestEnergy = pMath.Angle.Between(this.mc.x, this.mc.y, nearestEnergy.x, nearestEnergy.y);

      this.guideArrow.setPosition(this.mc.x, this.mc.y);
      this.guideArrow.setRotation(angleToNearestEnergy + (Math.PI / 2));
    }
    else {
      this.guideArrow.setVisible(false);
    }

    if (!this.mc.isDead) {
      const d = pMath.Distance.Between(this.mc.x, this.mc.y, this.mcTarget.x, this.mcTarget.y);

      if (this.mc.body.speed > 0) {
        if (d < 4) {
          this.mc.body.reset(this.mcTarget.x, this.mcTarget.y);
          this.arrow.setVisible(false);
        }
      }
    }
    else {
      this.mc.body.reset(this.mc.x, this.mc.y);
      this.arrow.setVisible(false);
    }

    for (let g in this.guards) {
      this.guards[g].update();
    }

    for (let b in this.bads) {
      this.bads[b].update();
    }
  }

}
export default GameScene;