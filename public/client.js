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
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  players.forEach(function (player) {
    context.drawImage(images.eye, player.x - images.eye.width / 2, player.y - images.eye.height / 2);
    context.fillText(player.username, player.x, player.y + 15);
  });
  context.restore();
};

var drawPointer = function drawPointer(context, pointer) {
  context.save();
  context.beginPath();
  context.arc(pointer.x, pointer.y, 5, 0, 2 * Math.PI, false);
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
  Object.entries(info).forEach(function (_ref, index) {
    var _ref2 = _slicedToArray$1(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

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

var players = {
  me: createPlayer('me'),
  others: new Map()
};

var world = {
  width: 0,
  height: 0
};

var trees = new Set();
var holes = new Set();

var scene = {
  pointer: pointer,
  players: players,
  holes: holes,
  trees: trees,
  world: world
};

var render = function render(scene, dt, time) {
  clear(ctx, canvas.width, canvas.height);

  // move world to mimic camera
  ctx.save();
  ctx.translate(-scene.players.me.x + canvas.width / 2, -scene.players.me.y + canvas.height / 2);
  drawOtherPlayers(ctx, scene.players.others);
  drawWorld(ctx, scene.world);
  ctx.restore();

  drawPlayer(ctx, canvas.width / 2, canvas.height / 2, time);
  drawPointer(ctx, scene.pointer);
  drawDebugInfo(ctx, { ping: ping });
};

var update = function update(scene, dt) {
  var players = scene.players;
  // Add easing to compensate lag

  players.me.x += (players.me.sx - players.me.x) / 5;
  players.me.y += (players.me.sy - players.me.y) / 5;

  players.others.forEach(function (player) {
    player.x += (player.sx - player.x) / 5;
    player.y += (player.sy - player.y) / 5;
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

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;

  pointer.x = canvas.width * y / 180;
  pointer.y = canvas.height * x / 180;
  pointer.cw = canvas.width;
  pointer.ch = canvas.height;
  socket.emit('c:pointer', pointer);
});

socket.on('s:players:update', function (_ref2) {
  var me = _ref2.me,
      others = _ref2.others;

  // Filter out removed players
  scene.players.others = new Map([].concat(_toConsumableArray(scene.players.others)).filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        id = _ref4[0];

    return others.find(function (playerData) {
      return playerData.id === id;
    }) != null;
  }));
  // Update players data and add already joined player
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

socket.on('s:world:update', function (_ref5) {
  var width = _ref5.width,
      height = _ref5.height;

  scene.world.width = width;
  scene.world.height = height;
});

loop(0);

}());
