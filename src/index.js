import * as PIXI from 'pixi.js';
import PlayerShip from './Actors/PlayerShip';
import Bullet from './Actors/Bullet';
import Vec2 from './Utils/Vec2';
import Asteroid from './Actors/Asteroid';
import DebugOverlay from './Utils/DebugOverlay';

let app, canvas, debug, player;
let score = 0;
const bullets = [];
const asteroids = [];
  
function onLoad(){
  canvas = document.getElementById("pixi-overlay");

  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  app = new PIXI.Application({  
    width: window.innerWidth,         // default: 800
    height: window.innerHeight,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    view: canvas,
  });

  

  player = new PlayerShip(window.innerWidth / 2, window.innerHeight / 2);
  app.stage.addChild(player.pixiObj);
  debug = new DebugOverlay();
  debug.enable();
  app.stage.addChild(debug.pixiObj);

  // Listen for animate update
  let dt;
  let asteroidSpawnTime = 5;
  let asteroidSpawnWindow = 5; 
  app.ticker.add((delta) => {
    dt = delta / 60;

    // spawn asteroids
    asteroidSpawnTime -= dt;
    if (asteroidSpawnTime <= 0) {
      // MAKE HARDER HERE
      asteroidSpawnTime = asteroidSpawnWindow;
      asteroids.push(new Asteroid());
      app.stage.addChild(asteroids[asteroids.length - 1].pixiObj);
    }

    // update the things
    player.update(dt);
    bullets.forEach(b => b.update(dt));
    asteroids.forEach(a => {
      a.update(dt);

      // Player die here
      if (a.checkHit(player)) console.log('You die');

      bullets.forEach(b => {
        if (a.checkHit(b)) {
          b.splode();
          a.takeHit();
        }
      });
    });
    debug.update(player, bullets, asteroids);

    // Remove bullets
    const bulletToRemove = bullets.findIndex(b => b.life <= 0);
    if (bulletToRemove !== -1) {
      bullets[bulletToRemove].pixiObj.destroy();
      bullets.splice(bulletToRemove, 1);
      // PARTICLES
    }

    const asteroidToRemove = asteroids.findIndex(a => a.life <= 0);
    if (asteroidToRemove !== -1) {
      asteroids[asteroidToRemove].pixiObj.destroy();
      asteroids.splice(asteroidToRemove, 1);
      score += 1;
    }
  });


  // all the player interaction stuff
  // canvas.addEventListener('mouseup', (e) => {
  //   console.log('shoot', e)
  // });
  const mTouch = new Vec2(0, 0);
  canvas.addEventListener('touchmove', (e) => {
    mTouch.set(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    player.setDirection(mTouch);
  });
  canvas.addEventListener('touchend', (e) => {
    const touch = new Vec2(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const newB = new Bullet(touch, player);
    player.addImpulse(touch);
    bullets.push(newB);
    app.stage.addChild(newB.pixiObj);
  });
}

window.onload = onLoad;
