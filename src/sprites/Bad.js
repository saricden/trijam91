import {GameObjects, Math as pMath} from 'phaser';
const {Sprite} = GameObjects;
const {Vector2} = pMath;

class Bad extends Sprite {
  constructor({scene, x, y}) {
    super(scene, x, y, 'bad');

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.target = new Vector2();

    this.isDead = false;

    scene.physics.add.overlap(this, scene.mc, this.kaboom, null, this);

    for (let g in scene.guards) {
      scene.physics.add.overlap(this, scene.guards[g], this.gKaboom, null, this);
    }

    this.setScale(2);
    this.mc = scene.mc;
    this.scene = scene;
  }

  kaboom(bad, mc) {
    if (!bad.isDead && !bad.scene.hasLost) {
      bad.scene.sound.play('boom2');

      bad.boom = bad.scene.add.sprite(mc.x, mc.y, 'kaboom');
      bad.boom.setScale(2);
      bad.boom.play({ key: 'boom', repeat: 0 });
      bad.boom.once('animationcomplete', () => {
        bad.boom.setVisible(false);
        bad.scene.gameOver();
      })

      mc.setVisible(false);
      bad.setVisible(false);
      mc.setActive(false);
      bad.setActive(false);

      bad.isDead = true;
      mc.isDead = true;
    }
  }

  gKaboom(bad, guard) {
    if (!bad.isDead && !guard.isDead) {

      bad.scene.sound.play('boom1');

      bad.boom = bad.scene.add.sprite(bad.x, bad.y, 'kaboom');
      bad.boom.setScale(2);
      bad.boom.play({ key: 'boom', repeat: 0 });
      bad.boom.once('animationcomplete', () => {
        bad.boom.setVisible(false);
      })

      guard.setVisible(false);
      bad.setVisible(false);
      guard.setActive(false);
      bad.setActive(false);

      bad.isDead = true;
      guard.isDead = true;
    }
  }

  update() {
    if (!this.isDead) {
      const d2mc = pMath.Distance.Between(this.x, this.y, this.mc.x, this.mc.y);

      if (d2mc < 400) {
        this.scene.physics.moveToObject(this, this.mc, 150);
      }
      else {
        this.body.reset(this.x, this.y);
      }
    }
  }
}

export default Bad;