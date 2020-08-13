const { defaultFilterVertex } = require("pixi.js");
import * as PIXI from 'pixi.js';

class DebugOverlay {
  constructor() {
    this.pixiObj = new PIXI.Graphics();
    this.pixiObj.zIndex = 10;
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
  
  disable() {
    this.enabled = false;
    this.pixiObj.clear();
  }

  update(player, bullets, asteroids) {
    if (!this.enabled) return;

    // Draw hit boxes/circles
    this.pixiObj.clear();
    this.pixiObj.lineStyle(2, 0x0000FF, 1);
    this.pixiObj.drawCircle(player.x, player.y, player.hitRadius);

    bullets.forEach(b => this.pixiObj.drawCircle(b.x, b.y, b.hitRadius));
    asteroids.forEach(a => this.pixiObj.drawCircle(a.x, a.y, a.hitRadius));
  }
}

export default DebugOverlay;
