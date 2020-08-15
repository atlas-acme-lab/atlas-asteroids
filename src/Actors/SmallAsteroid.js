import * as PIXI from 'pixi.js';
import Vec2 from '../Utils/Vec2';

const asteroidSprites = [
  'Assets/Image/Light/Asteroid 1.png',
  'Assets/Image/Light/Asteroid 2.png',
  'Assets/Image/Light/Asteroid 3.png',
  'Assets/Image/Light/Asteroid 4.png'
];

class SmallAsteroid {
  constructor(center, angle, bulletImpulse) {
    this.type = 'SMOL';
    this.pixiObj = PIXI.Sprite.from(asteroidSprites[Math.floor(Math.random() * 4)]);
    this.pixiObj.zIndex = 20;
    this.pixiObj.anchor.set(0.5, 0.5);
    this.size = window.innerWidth * 0.0003;// temp up scale for debug // window.innerWidth * 0.001;
    this.hitRadius = window.innerWidth * 0.07;
    this.pixiObj.scale.set(this.size);
    this.spin = (Math.random() - 0.5) * 3;

    this.pixiObj.tint = 0xAAAAAA;
    this.flashTime = 0;
    this.FLASH_MAX = 0.05;

    this.velocity = Vec2.fromAngle(angle).add(bulletImpulse.clone().normalize().scale(0.5)).scale(45);
    this.x = center.x + this.velocity.x * 0.3;
    this.y = center.y + this.velocity.y * 0.3;
  
    // Set at start pos
    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
    this.life = 3;
  }

  takeHit() {
    this.life -= 1;
    this.flashTime = this.FLASH_MAX;
  }

  checkHit(o) {
    return Vec2.dist2(this, o) < (this.hitRadius * this.hitRadius) + (o.hitRadius * o.hitRadius);
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

export default SmallAsteroid;
