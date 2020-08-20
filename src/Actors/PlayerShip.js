import * as PIXI from 'pixi.js';
import Vec2 from '../Utils/Vec2';

const tints = [
  0xFFFF77,
  0xFF77FF,
  0x000000,
  0x77FFFF,
  0xFFFFFF,
  // 0x21006F,
];

const trailSize = 8 ;

let laserSound = new Audio('Assets/Sound/laser.mp3');
laserSound.volume = 0.4;

class PlayerShip {
  constructor(startX, startY) {
    this.pixiObj = PIXI.Sprite.from('Assets/Image/Light/Acme_A.png');
    this.x = startX;
    this.y = startY;
    this.pixiObj.anchor.set(0.5, 0.5);
    this.size = window.innerWidth * 0.0007;
    this.hitRadius = window.innerWidth * 0.035;
    this.pixiObj.scale.set(this.size);
    this.pixiObj._zIndex = 20;
    this.velocity = new Vec2(0, 0);
    this.trailSprites = [];
    this.trailPos = [];
    this.tintShiftTime = 0.05;
    this.TINT_SHIFT_WINDOW = 0.07;

    for (let i = 0; i < trailSize; i++) {
      const ts = PIXI.Sprite.from('Assets/Image/Light/Acme_A.png');
      ts.x = startX;
      ts.y = startY;
      ts.game_tint_index = i % 5;
      ts.tint = tints[ts.game_tint_index];
      // ts.zIndex = trailSize - i;
      ts.anchor.set(0.5, 0.5);
      ts.scale.set(window.innerWidth * (0.0003 + 0.00025 * (trailSize - i) / trailSize));
      ts.alpha = 0.3 + 0.4 * (trailSize - i) / trailSize;
      this.trailSprites.push(ts);
    }
  
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
    laserSound.currentTime = 0.1;
    laserSound.play();
    const dv = Vec2.sub(touch, this).normalize().scale(0.2);
    this.pixiObj.rotation = dv.getAngle() - Math.PI / 2;
    this.setDirection(touch);
    this.velocity.add(dv);
  }

  update(dt) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.pixiObj.rotation = this.rotTarget;


    this.tintShiftTime -= dt;
    if (this.tintShiftTime <0) {
      this.trailPos.unshift(new Vec2(this.x, this.y));
      if (this.trailPos.length > trailSize) {
        this.trailPos.pop();
      }
      this.trailSprites.forEach((ts, i) => {
        ts.rotation = this.rotTarget;
        ts.game_tint_index = (ts.game_tint_index + 1) % tints.length;
        ts.tint = tints[ts.game_tint_index];

        if (this.trailPos.length > i) {
          ts.x = this.trailPos[i].x;
          ts.y = this.trailPos[i].y;
        }
      });

    
      this.tintShiftTime = this.TINT_SHIFT_WINDOW;
    }
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
