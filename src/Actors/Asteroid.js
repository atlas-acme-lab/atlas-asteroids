import * as PIXI from 'pixi.js';
import Vec2 from '../Utils/Vec2';

class Asteroid {
  constructor() {
    this.pixiObj = PIXI.Sprite.from('Assets/Image/Light/Bullet.png');
    this.pixiObj.anchor.set(0.5, 0.5);
    this.size = window.innerWidth * 0.006;// temp up scale for debug // window.innerWidth * 0.001;
    this.hitRadius = window.innerWidth * 0.09;
    this.pixiObj.scale.set(this.size);

    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() > 0.499 ? -this.size * 80 : window.innerHeight + this.size * 80;

    this.velocity = new Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize().scale(1);
  
    // Set at start pos
    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
    this.life = 4;
  }

  takeHit() {
    this.life -= 1;
  }

  checkHit(o) {
    return Vec2.dist2(this, o) < (this.hitRadius * this.hitRadius) + (o.hitRadius * o.hitRadius);
  }

  update(dt) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Loop logic, should be same for all thing
    const screenExtend = this.size * 80;
    if (this.x > window.innerWidth + screenExtend) this.x = -screenExtend;
    if (this.x < -screenExtend) this.x = window.innerWidth + screenExtend;
    if (this.y > window.innerHeight + screenExtend) this.y = -screenExtend;
    if (this.y < -screenExtend) this.y = window.innerHeight + screenExtend;

    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
  }
}

export default Asteroid;
