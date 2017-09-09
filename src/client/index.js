import assets from './assets';
import input from './input';

const hole = document.createElement('img');
hole.src = assets.hole;
hole.addEventListener('load', () => {
  const { width, height } = hole;
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

const eye_closed = document.createElement('img');
eye_closed.src = assets.eye_closed;
eye_closed.addEventListener('load', () => {
  const { width, height } = eye_closed;
  console.log({ width, height });
});

const powerup = document.createElement('img');
powerup.src = assets.powerup;
powerup.addEventListener('load', () => {
  const { width, height } = powerup;
  console.log({ width, height });
});

const eyes = [eye, eye, eye, eye, eye_closed];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pointer = {
  x: canvas.width / 2,
  y: canvas.height / 2
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

let ping = 0;

socket.on('pong', (ms) => {
  ping = ms;
});

const createPlayer = (id) => ({
  id,
  x: 0,
  y: 0,
  sx: 0,
  sy: 0,
})

const players = {
  me: createPlayer('me'),
  others: new Map(),
};
console.log(players)
const scene = {
  pointer,
  players,
};

const render = (scene, dt, time) => {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "#2c5b1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // move world instead of player
  ctx.save();
  ctx.translate(-scene.players.me.x + (canvas.width / 2 - eye.width / 2), -scene.players.me.y + (canvas.height / 2 - eye.height / 2));

  ctx.drawImage(hole, 0,0, 200, 200);
  ctx.drawImage(hole, 300,200, 100, 100);

  ctx.drawImage(powerup, 300 ,50);

  ctx.drawImage(tree, 20, 200);
  ctx.drawImage(tree, 250, 300);
  ctx.drawImage(tree, 90, 400, 123*2, 157*2);

  ctx.globalCompositeOperation = 'soft-light';
  ctx.drawImage(stamp, -100, -200, 500, 500);
  ctx.drawImage(stamp2, 300, 200, 300, 300);
  ctx.globalCompositeOperation = 'source-over';

  scene.players.others.forEach((player) => {
    ctx.drawImage(eye, player.x, player.y);
  });

  ctx.restore();

  const avatar = eyes[Math.round(time / 500) % 5];
  ctx.drawImage(avatar, canvas.width / 2 - eye.width / 2, canvas.height / 2 - eye.height / 2);

  ctx.beginPath();
  ctx.arc(scene.pointer.x, scene.pointer.y, 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'top';
  ctx.fillText(`ping: ${ping}`, 10, 10);
};

const update = (scene, dt) => {
  const { players } = scene;
  // Add easing to compensate lag
  players.me.x += (players.me.sx - players.me.x) / 5;
  players.me.y += (players.me.sy - players.me.y) / 5;

  players.others.forEach(player => {
    player.x += (player.sx - player.x) / 5;
    player.y += (player.sy - player.y) / 5;
  });
};

let oldTime = 0;
const loop = time => {
  requestAnimationFrame(loop);
  const dt = time - oldTime;
  update(scene, dt, time);
  render(scene, dt, time);
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
  pointer.cw = canvas.width;
  pointer.ch = canvas.height;
  socket.emit('c:pointer', pointer);
});

socket.on('s:players', ({ me, others }) => {
  others.forEach((playerData) => {
    let player = scene.players.others.get(playerData.id);
    if(!player) {
      player = createPlayer(playerData);
      scene.players.others.set(playerData.id, player);
      return;
    }
    player.sx = playerData.x;
    player.sy = playerData.y;
  });

  scene.players.me.sx = me.x;
  scene.players.me.sy = me.y;
});

loop(0);
