import * as PIXI from 'pixi.js';
import Vec2 from '../Utils/Vec2';

class Bullet {
  constructor(touch, player) {
    this.pixiObj = PIXI.Sprite.from('Assets/Image/Light/Bullet.png');
    this.x = player.x;
    this.y = player.y;
    this.pixiObj.anchor.set(0.5);
    this.size = window.innerWidth * 0.001;
    this.hitRadius = window.innerWidth * 0.015;
    this.pixiObj.scale.set(this.size);

    this.velocity = Vec2.sub(player, touch).normalize().scale(10);
  
    // Set at start pos
    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
    this.life = 1;
  }

  splode() {
    this.life = 0;
  }

  update(dt) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life -= dt;

    // Loop logic, should be same for all thing
    // const screenExtend = this.size * 40;
    // if (this.x > window.innerWidth + screenExtend) this.x = -screenExtend;
    // if (this.x < -screenExtend) this.x = window.innerWidth + screenExtend;
    // if (this.y > window.innerHeight + screenExtend) this.y = -screenExtend;
    // if (this.y < -screenExtend) this.y = window.innerHeight + screenExtend;

    this.pixiObj.x = this.x;
    this.pixiObj.y = this.y;
  }
}

export default Bullet;