'use strict';

var loop = (function (func) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

  var lastUpdate = Date.now();
  var loop = function loop() {
    var now = Date.now();
    var dt = now - lastUpdate;
    func(dt);
    lastUpdate = now;
  };

  var intervalID = setInterval(loop, delay);
  return function () {
    return clearInterval(intervalID);
  };
});

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var createPlayer = function createPlayer(userId, x, y) {
  return {
    userId: userId,
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0
  };
};

var createWorld = function createWorld(width, height) {
  return {
    width: width,
    height: height
  };
};

var createGame = function createGame() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      _ref$maxUsersCount = _ref.maxUsersCount,
      maxUsersCount = _ref$maxUsersCount === undefined ? 2 : _ref$maxUsersCount;

  var users = new Set();
  var world = createWorld(2000, 2000);

  var update = function update(dt) {
    // Players position calculation
    users.forEach(function (_ref2) {
      var player = _ref2.player,
          pointer = _ref2.pointer;

      if (!pointer) {
        return;
      }
      player.ax = pointer.x - pointer.cw / 2;
      player.ay = pointer.y - pointer.ch / 2;

      // Dead zone
      var deadZone = 8;
      if (Math.abs(player.ax) < deadZone) {
        player.ax = 0;
      } else {
        if (player.ax > 0) player.ax -= deadZone;
        if (player.ax < 0) player.ax += deadZone;
      }

      if (Math.abs(player.ay) < deadZone) {
        player.ay = 0;
      } else {
        if (player.ay > 0) player.ay -= deadZone;
        if (player.ay < 0) player.ay += deadZone;
      }

      player.vx += player.ax * dt / 1000;
      player.vy += player.ay * dt / 1000;

      var speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      var maxSpeed = 30;
      if (speed > maxSpeed) {
        var factor = speed / maxSpeed;
        player.vx /= factor;
        player.vy /= factor;
      }

      player.vx *= 0.98;
      player.vy *= 0.98;

      player.x += player.vx * dt / 100;
      player.y += player.vy * dt / 100;
    });

    // World boundary players collision
    users.forEach(function (_ref3) {
      var player = _ref3.player;

      if (player.x < 0) {
        player.x = 0;
        player.ax *= -1;
        player.vx *= -1;
      } else if (player.x > world.width) {
        player.x = world.width;
        player.ax *= -1;
        player.vx *= -1;
      }
      if (player.y < 0) {
        player.y = 0;
        player.ay *= -1;
        player.vy *= -1;
      } else if (player.y > world.height) {
        player.y = world.height;
        player.ay *= -1;
        player.vy *= -1;
      }
    });
  };

  var sync = function sync() {
    users.forEach(function (currentUser) {
      var others = [].concat(_toConsumableArray$1(users)).filter(function (user) {
        return user !== currentUser;
      }).map(function (user) {
        return {
          x: user.player.x,
          y: user.player.y,
          id: user.socket.id,
          username: user.username
        };
      });

      var me = {
        x: currentUser.player.x,
        y: currentUser.player.y,
        id: currentUser.socket.id,
        me: true
      };

      currentUser.socket.emit('s:players:update', { me: me, others: others });
      currentUser.socket.emit('s:world:update', world);
    });
  };

  var destroy = loop(function (dt) {
    update(dt);
    sync();
  });

  return {
    maxUsersCount: maxUsersCount,
    addUser: function addUser(user) {
      users.add(user);
      user.player = createPlayer(user.socket.id, 500, 500);
    },
    removeUser: function removeUser(user) {
      users.delete(user);
    },

    get usersCount() {
      return users.size;
    },
    destroy: function destroy() {
      clearInterval(interval);
    }
  };
};

var createUser = function createUser(socket, username) {
  return {
    socket: socket,
    username: username,
    game: null,
    player: null,
    pointer: null
  };
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var users = new Set();
var games = new Set();

var userId = 0;
var gameId = 0;

var findOrCreateGame = function findOrCreateGame() {
  var game = [].concat(_toConsumableArray(games)).find(function (game) {
    return game.usersCount < game.maxUsersCount;
  });
  if (!game) {
    game = createGame({ name: 'Game ' + gameId++ });
    games.add(game);
  }
  return game;
};

var index = (function (socket) {
  console.log('connect: ' + socket.id);

  var _socket$handshake$que = socket.handshake.query.username,
      username = _socket$handshake$que === undefined ? 'Guest ' + userId++ : _socket$handshake$que;

  console.log(username);
  var user = createUser(socket, username);
  users.add(user);

  var game = findOrCreateGame();
  user.game = game;
  game.addUser(user);

  socket.on("disconnect", function () {
    console.log('disconnect: ' + socket.id);
    users.delete(user);
    user.game.removeUser(user);
  });

  socket.on("c:pointer", function (pointer) {
    if (user.game) {
      user.pointer = pointer;
    }
  });
});

module.exports = index;
