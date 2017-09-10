(function () {
'use strict';

var assets = ['assets/hole.svg', 'assets/stamp.svg', 'assets/tree.svg', 'assets/eye.svg', 'assets/stamp2.svg', 'assets/eye_closed.svg', 'assets/heart.svg', 'assets/projectile.svg', 'assets/arrow.svg', 'assets/powerup.svg'];

var images = assets.reduce(function (images, asset) {
  var image = document.createElement('img');
  image.src = asset;
  var imageName = /(\w*)\.svg/g.exec(asset)[1];
  images[imageName] = image;
  return images;
}, {});

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var clear = function clear(context, width, height) {
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
  context.fillStyle = "#2c5b1e";
  context.fillRect(0, 0, width, height);
};

var drawWorld = function drawWorld(context, world) {
  context.save();
  context.strokeStyle = "#fff";
  context.lineWidth = 5;
  context.shadowColor = "#000";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.setLineDash([10, 5]);
  context.strokeRect(0, 0, world.width, world.height);
  context.restore();
};

var drawTrees = function drawTrees(context, trees) {
  context.save();
  context.strokeStyle = "#513213";
  context.lineWidth = 2;
  context.shadowColor = "#000";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.setLineDash([10, 5]);
  trees.forEach(function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        r = _ref.r;

    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.stroke();
  });
  context.restore();
};

var drawHoles = function drawHoles(context, holes) {
  context.save();
  context.strokeStyle = "#e3301a";
  context.lineWidth = 2;
  context.shadowColor = "#000";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.setLineDash([10, 5]);
  holes.forEach(function (_ref2) {
    var x = _ref2.x,
        y = _ref2.y,
        r = _ref2.r;

    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.stroke();
  });
  context.restore();
};

var playerSprite = [images.eye, images.eye, images.eye, images.eye, images.eye_closed];
var drawPlayer = function drawPlayer(context, x, y, time) {
  var sprite = playerSprite[Math.round(time / 500) % 5];
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.7)";
  context.font = 'bold 12px sans-serif';
  context.textAlign = 'center';
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 2;
  context.drawImage(sprite, x - sprite.width / 2, y - sprite.height / 2);
  context.restore();
};

var drawOtherPlayers = function drawOtherPlayers(context, players) {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.7)";
  context.font = 'bold 12px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  players.forEach(function (_ref3) {
    var x = _ref3.x,
        y = _ref3.y,
        username = _ref3.username;

    context.drawImage(images.eye, x - images.eye.width / 2, y - images.eye.height / 2);
    context.fillText(username, x, y + 15);
  });
  context.restore();
};

var drawProjectiles = function drawProjectiles(context, projectiles) {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 1)";
  projectiles.forEach(function (projectile) {
    context.arc(x, y, 5, 0, 2 * Math.PI, false);
    context.fill();
  });
  context.restore();
};

var drawPointer = function drawPointer(context, x, y) {
  context.save();
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI, false);
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.stroke();
  context.restore();
};

var drawDebugInfo = function drawDebugInfo(context, info) {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 1)";
  context.font = '12px sans-serif';
  context.textAlign = 'start';
  context.textBaseline = 'top';
  Object.entries(info).forEach(function (_ref4, index) {
    var _ref5 = _slicedToArray$1(_ref4, 2),
        key = _ref5[0],
        value = _ref5[1];

    context.fillText(key + ': ' + value, 10, 10 + index * 15);
  });
  context.restore();
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var pointer = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

var initGfx = function initGfx() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  pointer.x = canvas.width / 2;
  pointer.y = canvas.height / 2;
};

window.addEventListener("resize", initGfx);
initGfx();

var socket = void 0;
if (window.location.port === '8080') {
  socket = io(window.location.hostname + ':3000', {
    upgrade: false,
    transports: ["websocket"],
    query: '' + new URL(window.location).searchParams
  });
} else {
  socket = io({
    upgrade: false,
    transports: ["websocket"],
    query: '' + new URL(window.location).searchParams
  });
}

var ping = 0;

socket.on('pong', function (ms) {
  ping = ms;
});

var createPlayer = function createPlayer(_ref) {
  var id = _ref.id,
      _ref$username = _ref.username,
      username = _ref$username === undefined ? '' : _ref$username;
  return {
    id: id,
    username: username,
    x: 0,
    y: 0,
    sx: 0,
    sy: 0
  };
};

var createProjectile = function createProjectile(_ref2) {
  var id = _ref2.id,
      x = _ref2.x,
      y = _ref2.y;
  return {
    x: 0,
    y: 0,
    sx: 0,
    sy: 0
  };
};

var players = {
  me: createPlayer('me'),
  others: new Map()
};

var projectiles = new Map();

var world = {
  width: 0,
  height: 0,
  holes: new Set(),
  trees: new Set()
};

var scene = {
  pointer: pointer,
  players: players,
  projectiles: projectiles,
  world: world
};

var render = function render(scene, dt, time) {
  clear(ctx, canvas.width, canvas.height);

  // Move the world to mimic camera
  ctx.save();
  ctx.translate(-scene.players.me.x + canvas.width / 2, -scene.players.me.y + canvas.height / 2);
  drawHoles(ctx, scene.world.holes);
  drawProjectiles(ctx, scene.projectiles);
  drawOtherPlayers(ctx, scene.players.others);
  drawTrees(ctx, scene.world.trees);
  drawWorld(ctx, scene.world);
  ctx.restore();

  drawPlayer(ctx, canvas.width / 2, canvas.height / 2, time);
  drawPointer(ctx, scene.pointer.x + canvas.width / 2, scene.pointer.y + canvas.height / 2);
  drawDebugInfo(ctx, { ping: ping });
};

var update = function update(scene, dt) {
  var players = scene.players,
      projectiles = scene.projectiles;
  // Add easing to compensate lag

  var STRENGTH = 5;
  players.me.x += (players.me.sx - players.me.x) / STRENGTH;
  players.me.y += (players.me.sy - players.me.y) / STRENGTH;

  players.others.forEach(function (player) {
    player.x += (player.sx - player.x) / STRENGTH;
    player.y += (player.sy - player.y) / STRENGTH;
  });

  projectiles.forEach(function (projectile) {
    projectile.x += (projectile.sx - projectile.x) / STRENGTH;
    projectile.y += (projectile.sy - projectile.y) / STRENGTH;
  });
};

var oldTime = 0;
var loop = function loop(time) {
  requestAnimationFrame(loop);
  var dt = time - oldTime;
  update(scene, dt, time);
  render(scene, dt, time);
  oldTime = time;
};

var origin = void 0;
window.addEventListener("deviceorientation", function (event) {
  if (!origin) {
    origin = {
      beta: event.beta,
      gamma: event.gamma
    };
  }

  var x = event.beta - origin.beta; // In degree in the range [-180,180]
  var y = event.gamma - origin.gamma; // In degree in the range [-90,90]

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

document.addEventListener('touchstart', function () {
  socket.emit('c:fire:pressed');
});

socket.on('s:players:update', function (_ref3) {
  var me = _ref3.me,
      others = _ref3.others;

  // Filter out removed players
  scene.players.others = new Map([].concat(_toConsumableArray(scene.players.others)).filter(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 1),
        id = _ref5[0];

    return others.find(function (playerData) {
      return playerData.id === id;
    }) != null;
  }));
  // Update players data and add already joined players
  others.forEach(function (playerData) {
    var player = scene.players.others.get(playerData.id);
    if (!player) {
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

socket.on('s:projectiles:update', function (projectiles) {
  // Filter out removed projectiles
  scene.projectiles = new Map([].concat(_toConsumableArray(scene.projectiles)).filter(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 1),
        id = _ref7[0];

    return projectiles.find(function (projectileData) {
      return projectileData.id === id;
    }) != null;
  }));
  // Update projectiles data and add new projectiles
  projectiles.forEach(function (projectileData) {
    var projectile = scene.projectiles.get(projectileData.id);
    if (!projectile) {
      player = createProjectile(projectileData);
      scene.projectiles.set(projectileData.id, projectile);
      return;
    }
    projectile.sx = projectileData.x;
    projectile.sy = projectileData.y;
  });
});

socket.on('s:world:create', function (_ref8) {
  var width = _ref8.width,
      height = _ref8.height,
      trees = _ref8.trees,
      holes = _ref8.holes;

  scene.world.width = width;
  scene.world.height = height;
  scene.world.trees = new Set(trees);
  scene.world.holes = new Set(holes);
});

loop(0);

}());
