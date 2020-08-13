import * as PIXI from 'pixi.js';
import Vec2 from '../Utils/Vec2';

class PlayerShip {
  constructor(startX, startY) {
    this.pixiObj = PIXI.Sprite.from('Assets/Image/Light/Acme_A.png');
    this.x = startX;
    this.y = startY;
    this.pixiObj.anchor.set(0.5, 0.5);
    this.size = window.innerWidth * 0.001;
    this.hitRadius = window.innerWidth * 0.045;
    this.pixiObj.scale.set(this.size);
    this.velocity = new Vec2(0, 0);
  
    this.rotTarget = 0;
    // Set at start pos
    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
  }

  // expects a vec 2
  setDirection(touch) {
    this.rotTarget = touch.sub(this).getAngle() + Math.PI / 2;
  }

  addImpulse(touch) {
    const dv = Vec2.sub(touch, this).normalize().scale(0.3);
    this.pixiObj.rotation = dv.getAngle() - Math.PI / 2;
    this.setDirection(touch);
    this.velocity.add(dv);
  }

  update(dt) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.pixiObj.rotation = this.rotTarget;
    // if (this.pixiObj.rotation < this.rotTarget - 0.02) this.pixiObj.rotation += dt * this.rotSpeed;
    // else if (this.pixiObj.rotation > this.rotTarget + 0.02) this.pixiObj.rotation -= dt * this.rotSpeed

    // Loop logic, should be same for all thing
    const screenExtend = this.size * 40;
    if (this.x > window.innerWidth + screenExtend) this.x = -screenExtend;
    if (this.x < -screenExtend) this.x = window.innerWidth + screenExtend;
    if (this.y > window.innerHeight + screenExtend) this.y = -screenExtend;
    if (this.y < -screenExtend) this.y = window.innerHeight + screenExtend;

    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
  }
}

export default PlayerShip;
