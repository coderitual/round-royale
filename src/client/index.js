import {
  assetsReady,
  clear,
  drawWorld,
  drawPlayer,
  drawOtherPlayers,
  drawHoles,
  drawTrees,
  drawProjectiles,
  drawPointer,
  drawDebugInfo,
} from './graphics.js'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pointer = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

const initGfx = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  pointer.x = 0;
  pointer.y = 0;
};

window.addEventListener('resize', initGfx);
initGfx();

let socket;
if(window.location.port === '8080') {
  socket = io(`${window.location.hostname}:3000`, {
    upgrade: false,
    transports: ['websocket'],
    query: `${(new URL(window.location)).searchParams}`,
  });
} else {
  socket = io({
    upgrade: false,
    transports: ['websocket'],
    query: `${(new URL(window.location)).searchParams}`,
  });
}

const debugInfo = {
  ping: 0,
  fps: 0,
  players: 1,
  projectiles: 0,
};

socket.on('pong', (ms) => {
  debugInfo.ping = ms;
});

const createPlayer = ({ id, username = '' }) => ({
  id,
  username,
  x: 0,
  y: 0,
  sx: 0,
  sy: 0,
});

const createProjectile = ({ id, x, y }) => ({
  id,
  x,
  y,
  sx: 0,
  sy: 0,
});

const players = {
  me: createPlayer('me'),
  others: new Map(),
};

const projectiles = new Map();

const world = {
  width: 0,
  height: 0,
  holes: new Set(),
  trees: new Set(),
};

const scene = {
  pointer,
  players,
  projectiles,
  world,
};

const render = (scene, dt, time) => {
  clear(ctx, canvas.width, canvas.height);

  if(!assetsReady()) {
    return;
  }

  // Move the world to mimic camera
  ctx.save();
  ctx.translate(-scene.players.me.x + canvas.width / 2, -scene.players.me.y + canvas.height / 2);
  drawHoles(ctx, scene.world.holes);
  drawProjectiles(ctx, scene.projectiles);
  drawOtherPlayers(ctx, scene.players.others);
  drawWorld(ctx, scene.world);
  ctx.restore();

  drawPlayer(ctx, canvas.width / 2, canvas.height / 2, time);

  ctx.save();
  ctx.translate(-scene.players.me.x + canvas.width / 2, -scene.players.me.y + canvas.height / 2);
  drawTrees(ctx, scene.world.trees);
  ctx.restore();

  drawPointer(ctx, scene.pointer.x + canvas.width / 2, scene.pointer.y + canvas.height / 2);
  drawDebugInfo(ctx, debugInfo);
};

let frames = 0;
let timeAccu = 0;
const update = (scene, dt) => {
  const { players, projectiles } = scene;
  // Add easing to compensate lag
  const STRENGTH = 5;
  players.me.x += (players.me.sx - players.me.x) / STRENGTH;
  players.me.y += (players.me.sy - players.me.y) / STRENGTH;

  players.others.forEach(player => {
    player.x += (player.sx - player.x) / STRENGTH;
    player.y += (player.sy - player.y) / STRENGTH;
  });

  projectiles.forEach(projectile => {
    projectile.x += (projectile.sx - projectile.x) / STRENGTH;
    projectile.y += (projectile.sy - projectile.y) / STRENGTH;
  });

  timeAccu += dt;
  frames++;
  if (timeAccu > 1000) {
    debugInfo.fps = frames / timeAccu * 1000 | 0;
    frames = 0;
    timeAccu = 0;
  }
  debugInfo.players = scene.players.others.size + 1;
  debugInfo.projectiles = scene.projectiles.size;

};

let oldTime = 0;
const loop = time => {
  requestAnimationFrame(loop);
  const dt = time - oldTime;
  update(scene, dt, time);
  render(scene, dt, time);
  oldTime = time;
};

let deviceDetected = false;
let isTouch = true;
const detectDevice = (event) => {
  if (!deviceDetected) {
    if(event.beta === null) {
      canvas.classList.add('desktop');
      isTouch = false;
      initGfx();
    }
    deviceDetected = true;
  }
};

let origin;
window.addEventListener('deviceorientation', event => {
  detectDevice(event);

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

  pointer.x = canvas.width / 2 * y / 90 * 1.3;
  pointer.y = canvas.height / 2 * x / 90 * 1.3;
  socket.emit('c:pointer:update', pointer);
});

canvas.addEventListener('mousemove', (event) => {
  if(isTouch) {
    return;
  }
  pointer.x = event.clientX - canvas.offsetLeft - canvas.width / 2;
  pointer.y = event.clientY - canvas.offsetTop - canvas.height / 2;
  socket.emit('c:pointer:update', pointer);
});

document.addEventListener('mousedown', () => {
  if(isTouch) {
    return;
  }
  socket.emit('c:fire:pressed');
});

document.addEventListener('touchstart', (event) => {
  const { clientX, clientY } = event.touches[0];
  if(clientX < 90 && clientY < 90) {
    origin = null;
    return;
  }
  socket.emit('c:fire:pressed');
});

socket.on('s:players:update', ({ me, others }) => {
  // Filter out removed players
  scene.players.others = new Map([...scene.players.others].filter(([id]) => {
    return others.find(playerData => playerData.id === id) != null;
  }));
  // Update players data and add already joined players
  others.forEach((playerData) => {
    let player = scene.players.others.get(playerData.id);
    if(!player) {
      player = createPlayer(playerData);
      scene.players.others.set(playerData.id, player);
    }
    player.sx = playerData.x;
    player.sy = playerData.y;
  });

  scene.players.me.sx = me.x;
  scene.players.me.sy = me.y;
});

socket.on('s:projectiles:update', (projectiles) => {
  // Filter out removed projectiles
  scene.projectiles = new Map([...scene.projectiles].filter(([id]) => {
    return projectiles.find(projectileData => projectileData.id === id) != null;
  }));
  // Update projectiles data and add new projectiles
  projectiles.forEach((projectileData) => {
    let projectile = scene.projectiles.get(projectileData.id);
    if(!projectile) {
      projectile = createProjectile(projectileData);
      scene.projectiles.set(projectileData.id, projectile);
    }

    projectile.sx = projectileData.x;
    projectile.sy = projectileData.y;
  });
});

socket.on('s:world:create', ({ width, height, trees, holes }) => {
  scene.world.width = width;
  scene.world.height = height;
  scene.world.trees = new Set(trees);
  scene.world.holes = new Set(holes);
});

loop(0);
