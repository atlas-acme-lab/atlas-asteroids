import * as PIXI from 'pixi.js';
import Vec2 from '../Utils/Vec2';

const asteroidSprites = [
  'Assets/Image/Light/Asteroid 1.png',
  'Assets/Image/Light/Asteroid 2.png',
  'Assets/Image/Light/Asteroid 3.png',
  'Assets/Image/Light/Asteroid 4.png'
];

class Asteroid {
  constructor() {
    this.type = 'BIG';
    this.pixiObj = PIXI.Sprite.from(asteroidSprites[Math.floor(Math.random() * 4)]);
    this.pixiObj.anchor.set(0.5, 0.5);
    this.size = window.innerWidth * 0.0005;// temp up scale for debug // window.innerWidth * 0.001;
    this.hitRadius = window.innerWidth * 0.09;
    this.spin = (Math.random() - 0.5);
    this.pixiObj.scale.set(this.size);
    this.pixiObj.tint = 0xAAAAAA;
    this.flashTime = 0;
    this.FLASH_MAX = 0.05;

    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() > 0.499 ? -this.size * 230 : window.innerHeight + this.size * 230;

    this.velocity = new Vec2(Math.random() - 0.5, Math.random() - 0.5).normalize().scale(35);
  
    // Set at start pos
    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
    this.life = 5;
  }

  takeHit() {
    this.life -= 1;
    this.flashTime = this.FLASH_MAX;
  }

  checkHit(o) {
    return Vec2.dist2(this, o) < ((this.hitRadius * this.hitRadius) + (o.hitRadius * o.hitRadius));
  }

  update(dt) {
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;
    this.pixiObj.rotation += this.spin * dt;

    if (this.flashTime > 0) {
      this.flashTime -= dt;
      this.pixiObj.tint = 0xFFFFFF;
    } else {
      this.pixiObj.tint = 0xBBBBBB;
    }

    // Loop logic, should be same for all thing
    const screenExtend = this.size * 230;
    if (this.x > window.innerWidth + screenExtend) this.x = -screenExtend;
    if (this.x < -screenExtend) this.x = window.innerWidth + screenExtend;
    if (this.y > window.innerHeight + screenExtend) this.y = -screenExtend;
    if (this.y < -screenExtend) this.y = window.innerHeight + screenExtend;

    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
  }
}

export default Asteroid;
