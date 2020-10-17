import {GameObjects, Math as pMath} from 'phaser';
const {Sprite} = GameObjects;
const {Vector2} = pMath;

class Guard extends Sprite {
  constructor({scene, x, y}) {
    super(scene, x, y, 'gaurd');

    this.target = new Vector2();

    this.setScale(2);
    this.play({ key: 'g-fly', repeat: -1 });

    const xo = pMath.Between(-200, 200);
    const yo = pMath.Between(-200, 200);
    this.setPosition(scene.mc.x + xo, scene.mc.y + yo);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.isDead = false;

    scene.input.on('pointerup', (pointer) => {
      if (!scene.mc.isDead) {
        const {worldX, worldY} = pointer;
        const xo = pMath.Between(-200, 200);
        const yo = pMath.Between(-200, 200);

        this.target.x = worldX + xo;
        this.target.y = worldY + yo;

        const angle = pMath.Angle.Between(this.x, this.y, worldX + xo, worldY + yo);

        this.setRotation(angle + (Math.PI / 2));

        scene.physics.moveToObject(this, this.target, 200);
      }
    });

    this.scene = scene;
  }

  update() {
    const d = pMath.Distance.Between(this.x, this.y, this.target.x, this.target.y);

    if (this.body.speed > 0) {
      if (d < 4) {
        this.body.reset(this.target.x, this.target.y);
      }
    }
  }

}

export default Guard;