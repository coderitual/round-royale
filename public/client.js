(function () {
'use strict';

var assets = {
  test: 'assets/test.svg',
  drawing: 'assets/drawing.svg',
  hole: 'assets/hole.svg',
  stamp: 'assets/stamp.svg',
  tree: 'assets/tree.svg',
  eye: 'assets/eye.svg',
  stamp2: 'assets/stamp2.svg',
};

console.log(assets);

const img = document.createElement('img');
img.src = assets.hole;
img.addEventListener('load', () => {
  const { width, height } = img;
  console.log({ width, height });
});

const stamp = document.createElement('img');
stamp.src = assets.stamp;
stamp.addEventListener('load', () => {
  const { width, height } = stamp;
  console.log({ width, height });
});

const stamp2 = document.createElement('img');
stamp2.src = assets.stamp2;
stamp2.addEventListener('load', () => {
  const { width, height } = stamp2;
  console.log({ width, height });
});

const tree = document.createElement('img');
tree.src = assets.tree;
tree.addEventListener('load', () => {
  const { width, height } = tree;
  console.log({ width, height });
});

const eye = document.createElement('img');
eye.src = assets.eye;
eye.addEventListener('load', () => {
  const { width, height } = eye;
  console.log({ width, height });
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pointer = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0
};

const initGfx = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  pointer.x = canvas.width / 2;
  pointer.y = canvas.height / 2;
};

window.addEventListener("resize", initGfx);
initGfx();

let socket;
if(window.location.port === '8080') {
  socket = io(`${window.location.hostname}:3000`, { upgrade: false, transports: ["websocket"] });
} else {
  socket = io({ upgrade: false, transports: ["websocket"] });
}

const scene = {
  pointer,
  player
};

const render = scene => {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "#2c5b1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // move world instead of player
  ctx.save();
  ctx.translate(-scene.player.x, -scene.player.y);

  ctx.drawImage(img, 0,0, 200, 200);
  ctx.drawImage(img, 300,200, 100, 100);

  ctx.drawImage(tree, 20, 100);
  ctx.drawImage(tree, 250, 300);

  ctx.globalCompositeOperation = 'soft-light';
  ctx.drawImage(stamp, -100, -200, 500, 500);
  ctx.drawImage(stamp2, 300, 200, 300, 300);
  ctx.globalCompositeOperation = 'source-over';

  ctx.restore();

  ctx.drawImage(eye, canvas.width / 2 - eye.width / 2, canvas.height / 2 - eye.height / 2);

  ctx.beginPath();
  ctx.arc(scene.pointer.x, scene.pointer.y, 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#fff";
  ctx.stroke();

};

const update = (scene, dt) => {
  const { pointer, player } = scene;

  player.ax = (pointer.x - canvas.width / 2);
  player.ay = (pointer.y - canvas.height / 2);

  // Dead zone
  const deadZone = 5;
  if(Math.abs(player.ax) < deadZone) {
    player.ax = 0;
  } else {
    if(player.ax > 0) player.ax -= deadZone;
    if(player.ax < 0) player.ax += deadZone;
  }

  if(Math.abs(player.ay) < deadZone) {
    player.ay = 0;
  } else {
    if(player.ay > 0) player.ay -= deadZone;
    if(player.ay < 0) player.ay += deadZone;
  }

  player.vx += player.ax * dt / 1000;
  player.vy += player.ay * dt / 1000;

  player.vx *= 0.98;
  player.vy *= 0.98;

  player.x += player.vx * dt / 100;
  player.y += player.vy * dt / 100;
};

let oldTime = 0;
const loop = time => {
  requestAnimationFrame(loop);
  update(scene, time - oldTime);
  render(scene);
  oldTime = time;
};

window.addEventListener("deviceorientation", event => {
  let x = event.beta; // In degree in the range [-180,180]
  let y = event.gamma; // In degree in the range [-90,90]

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  pointer.x = canvas.width * y / 180;
  pointer.y = canvas.height * x / 180;

  socket.emit('pointer_data', pointer);
});

loop(0);

}());
