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
let endTitleDiv;

let leftANum = 1;
let rightANum = 1;
let leftATimer = 0.5;
let rightATimer = 0.8

function startUpdate(dt) {
  // spawn asteroids
  // asteroidSpawnTime -= dt;
  leftATimer -= dt;
  rightATimer -= dt;
  if (leftATimer < 0) {
    // console.log(`#left-a-${leftANum}`);
    document.querySelector(`#left-a-${leftANum}`).classList.add('hidden');

    leftATimer = 0.4;
    leftANum = ((leftANum + 1) % 13);
    if (leftANum === 0) leftANum = 1;
    document.querySelector(`#left-a-${leftANum}`).classList.remove('hidden');
  }

  if (rightATimer < 0) {
    // console.log(`#left-a-${leftANum}`);
    document.querySelector(`#right-a-${rightANum}`).classList.add('hidden');

    rightATimer = 0.3;
    rightANum = ((rightANum + 1) % 11);
    if (rightANum === 0) rightANum = 1;
    document.querySelector(`#right-a-${rightANum}`).classList.remove('hidden');
  }

  // update the things
  player.update(dt);
}

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

let colorChangeTime = 0;
let colorIndex = 0;
const tints = [
  '#FFFF77',
  '#FF77FF',
  // '#000000',
  '#77FFFF',
  '#FFFFFF',
]
function endUpdate(dt) {
  colorChangeTime -= dt;
  if (colorChangeTime <= 0) {
    colorChangeTime = 1/15;
    endTitleDiv.style = "color: " + tints[colorIndex];
    colorIndex += 1;
    colorIndex %= tints.length;
  }
}

let audio;
function onLoad(){
  canvas = document.getElementById("pixi-overlay");
  scoreEl = document.querySelector("#score");
  endTitleDiv = document.querySelector('#end-title');

  audio = new Audio('Assets/Sound/sd.wav');
  audio.loop = true;
  audio.volume = 0.4;

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
      case 'START':
        startUpdate(delta / 60);
        break;
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
      location.reload();
      // const data = {
      //   name: 'peter',
      //   score: '10',
      // }
      // //
      // //https://asteroids-test-485ae.firebaseio.com/
      // console.log(document.getElementById('score-name').value);
      // fetch('https://us-central1-asteroids-test-485ae.cloudfunctions.net/addScore', {
      //   method: 'POST', // or 'PUT'
      //   mode: 'cors',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // })
      // .then((d) => console.log(d))
      // .then(() => {
      //   fetch('https://us-central1-asteroids-test-485ae.cloudfunctions.net/getScores', {
      //     method: 'POST', // or 'PUT'
      //     mode: 'cors',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   })
      //   .then((b) => console.log(b))
      // })
      // .then(() => location.reload())
    }
  });

  const mTouch = new Vec2(0, 0);
  document.addEventListener('touchmove', (e) => {
    mTouch.set(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    player.setDirection(mTouch);
  });
  document.addEventListener('touchend', (e) => {
    switch (gameState) {
      case 'MAIN':
        const touch = new Vec2(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        const newB = new Bullet(touch, player);
        player.addImpulse(touch);
        bullets.push(newB);
        app.stage.addChild(newB.pixiObj);
        break;
      default: break;
    }
  });

  document.querySelector('#begin-button').addEventListener('click', (e) => {
    switch (gameState) {
      case 'START':
        gameState = 'MAIN';
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('game-overlay').classList.remove('hidden');
        audio.play();
        break;
      default: break;
    }
  });

  document.querySelector('#cycle-left-a').addEventListener('click', (e) => {
    switch (gameState) {
      case 'START':
        player.spriteID -= 1;
        if (player.spriteID < 0) player.spriteID = 5;

        app.stage.removeChild(player.pixiObj);
        player.setSprite();
        app.stage.addChild(player.pixiObj);
        break;
      default: break;
    }
  });

  document.querySelector('#cycle-right-a').addEventListener('click', (e) => {
    switch (gameState) {
      case 'START':
        player.spriteID += 1;
        if (player.spriteID > 5) player.spriteID = 0;

        app.stage.removeChild(player.pixiObj);
        player.setSprite();
        app.stage.addChild(player.pixiObj);
        break;
      default: break;
    }
  });
}

window.onload = onLoad;
