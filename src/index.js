import * as PIXI from 'pixi.js';
import PlayerShip from './Actors/PlayerShip';
import Bullet from './Actors/Bullet';
import Vec2 from './Utils/Vec2';
import Asteroid from './Actors/Asteroid';
import SmallAsteroid from './Actors/SmallAsteroid';
import DebugOverlay from './Utils/DebugOverlay';

let app, canvas, debug, player, scoreEl;
let score = 0;
const bullets = [];
const asteroids = [];
const splosions = [];

let gameState = 'START';
let asteroidSpawnTime = 5;
let asteroidSpawnWindow = 6;
let minSpawnWindow = 2;

let spawnRateIncreaseCounter = 5;
let spawnRateIncreaseInterval = 5;

function mainUpdate(dt) {
  // spawn asteroids
  asteroidSpawnTime -= dt;
  if (asteroidSpawnTime <= 0) {
    // MAKE HARDER HERE
    asteroidSpawnTime = asteroidSpawnWindow;
    asteroids.push(new Asteroid());
    app.stage.addChild(asteroids[asteroids.length - 1].pixiObj);

    spawnRateIncreaseCounter -= 1;
    if (spawnRateIncreaseCounter <= 0 && asteroidSpawnWindow > minSpawnWindow) {
      spawnRateIncreaseCounter = spawnRateIncreaseInterval;
      asteroidSpawnWindow -= 0.25;
    }
  }

  // update the things
  player.update(dt);
  bullets.forEach(b => b.update(dt));
  asteroids.forEach(a => {
    a.update(dt);

    // Player die here
    if (a.checkHit(player)) {
      gameState = 'END';
      document.getElementById('game-overlay').classList.add('hidden');
      document.getElementById('end-overlay').classList.remove('hidden');
      document.getElementById('end-score').innerHTML = score;
    }

    bullets.forEach(b => {
      if (a.checkHit(b)) {
        b.splode();
        a.takeHit();
      }
    });
  });
  debug.update(player, bullets, asteroids);

  // Remove splosions
  // const bulletToRemove = bullets.findIndex(b => b.life <= 0);
  // if (bulletToRemove !== -1) {
  //   bullets[bulletToRemove].pixiObj.destroy();
  //   bullets.splice(bulletToRemove, 1);
  //   // PARTICLES
  // }

  // Remove bullets
  const bulletToRemove = bullets.findIndex(b => b.life <= 0);

  const asteroidToRemove = asteroids.findIndex(a => a.life <= 0);
  if (asteroidToRemove !== -1) {
    if (asteroids[asteroidToRemove].type === 'BIG') {
      const angle = Math.random() * Math.PI;
      const interval = Math.PI * 2 / 3;
      for (let i = 0; i < 3; i++) {
        asteroids.push(
          new SmallAsteroid(
            asteroids[asteroidToRemove],
            angle + interval * i,
            bullets[bulletToRemove].velocity
          )
        );
        app.stage.addChild(asteroids[asteroids.length - 1].pixiObj);
      }
    }

    // ALSO ADD A SPLOSION AT THIS SPOT 
    asteroids[asteroidToRemove].pixiObj.destroy();
    asteroids.splice(asteroidToRemove, 1);
    score += 1;
    scoreEl.innerHTML = score;
  }

  // Doing this after bc, whatever
  if (bulletToRemove !== -1) {
    bullets[bulletToRemove].pixiObj.destroy();
    bullets.splice(bulletToRemove, 1);
    // PARTICLES
  }
}

function endUpdate() {

}

let audio;
function onLoad(){
  canvas = document.getElementById("pixi-overlay");
  scoreEl = document.querySelector("#score");

  audio = new Audio('Assets/Sound/sd.wav');
  audio.loop = true;

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
  for (let i = player.trailSprites.length - 1; i > -1; i--) {
    app.stage.addChild(player.trailSprites[i]);
  }
  app.stage.addChild(player.pixiObj);
  debug = new DebugOverlay();
  // debug.enable();
  debug.disable();
  app.stage.addChild(debug.pixiObj);

  // Listen for animate update
  app.ticker.add((delta) => {
    switch (gameState) {
      case 'MAIN':
        mainUpdate(delta / 60);
        break;
      case 'END':
        endUpdate(delta / 60);
        break;
      default: break;
    }
  });

  // Set up name enter
  document.getElementById('submit-score').addEventListener('click', () => {
    if (gameState === 'END') {
      console.log(document.getElementById('score-name').value);
      location.reload();
    }
  });


  // all the player interaction stuff
  // canvas.addEventListener('mouseup', (e) => {
  //   console.log('shoot', e)
  // });
  const mTouch = new Vec2(0, 0);
  document.addEventListener('touchmove', (e) => {
    mTouch.set(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    player.setDirection(mTouch);
  });
  document.addEventListener('touchend', (e) => {
    switch (gameState) {
      case 'START':
        gameState = 'MAIN';
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('game-overlay').classList.remove('hidden');
        audio.play();
        break;
      default:
        const touch = new Vec2(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        const newB = new Bullet(touch, player);
        player.addImpulse(touch);
        bullets.push(newB);
        app.stage.addChild(newB.pixiObj);
        break;
    }
  });
}

window.onload = onLoad;
