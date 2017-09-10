import input from './input';
import {
  clear,
  drawWorld,
  drawPlayer,
  drawOtherPlayers,
  drawHoles,
  drawTrees,
  drawPointer,
  drawDebugInfo
} from './graphics.js'

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
  socket = io(`${window.location.hostname}:3000`, {
    upgrade: false,
    transports: ["websocket"],
    query: `${(new URL(window.location)).searchParams}`,
  });
} else {
  socket = io({
    upgrade: false,
    transports: ["websocket"],
    query: `${(new URL(window.location)).searchParams}`,
  });
}

let ping = 0;

socket.on('pong', (ms) => {
  ping = ms;
});

const createPlayer = ({ id, username = '' }) => ({
  id,
  username,
  x: 0,
  y: 0,
  sx: 0,
  sy: 0,
});

const players = {
  me: createPlayer('me'),
  others: new Map(),
};

const world = {
  width: 0,
  height: 0,
  holes: new Set(),
  trees: new Set(),
};

const scene = {
  pointer,
  players,
  world,
};

const render = (scene, dt, time) => {
  clear(ctx, canvas.width, canvas.height);

  // move world to mimic camera
  ctx.save();
  ctx.translate(-scene.players.me.x + canvas.width / 2, -scene.players.me.y + canvas.height / 2);
  drawHoles(ctx, scene.world.holes);
  drawOtherPlayers(ctx, scene.players.others);
  drawTrees(ctx, scene.world.trees);
  drawWorld(ctx, scene.world);
  ctx.restore();

  drawPlayer(ctx, canvas.width / 2, canvas.height / 2, time);
  drawPointer(ctx, scene.pointer.x + canvas.width / 2, scene.pointer.y + canvas.height / 2);
  drawDebugInfo(ctx, { ping });
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

let origin;
window.addEventListener("deviceorientation", event => {
  if (!origin) {
    origin = {
      beta: event.beta,
      gamma: event.gamma,
    };
  }

  let x = event.beta - origin.beta; // In degree in the range [-180,180]
  let y = event.gamma - origin.gamma; // In degree in the range [-90,90]

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  pointer.x = canvas.width / 2 * y / 90;
  pointer.y = canvas.height / 2 * x / 90;
  socket.emit('c:pointer:update', pointer);
});

document.addEventListener('touchstart', () => {
  socket.emit('c:fire:pressed', pointer);
});

socket.on('s:players:update', ({ me, others }) => {
  // Filter out removed players
  scene.players.others = new Map([...scene.players.others].filter(([id]) => {
    return others.find(playerData => playerData.id === id) != null;
  }));
  // Update players data and add already joined player
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

socket.on('s:world:create', ({ width, height, trees, holes }) => {
  scene.world.width = width;
  scene.world.height = height;
  scene.world.trees = new Set(trees);
  scene.world.holes = new Set(holes);
});

loop(0);
