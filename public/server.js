'use strict';

var createPlayer = function createPlayer() {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0
  };
};

var createGame = function createGame() {
  var users = new Set();

  var update = function update(dt) {
    users.forEach(function (user) {
      var player = user.player,
          pointer = user.pointer;

      if (!pointer) {
        return;
      }
      player.ax = pointer.x - pointer.cw / 2;
      player.ay = pointer.y - pointer.ch / 2;

      // Dead zone
      var deadZone = 5;
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

      player.vx *= 0.98;
      player.vy *= 0.98;

      player.x += player.vx * dt / 100;
      player.y += player.vy * dt / 100;
    });
  };

  var sync = function sync() {
    users.forEach(function (user) {
      user.socket.emit('s:player', user.player.x, user.player.y);
    });
  };

  var lastUpdate = Date.now();
  var loop = function loop() {
    var now = Date.now();
    var dt = now - lastUpdate;
    update(dt);
    sync();
    lastUpdate = now;
  };

  var interval = setInterval(loop, 100);
  var destroy = function destroy() {
    return clearInterval(interval);
  };

  return {
    addUser: function addUser(user) {
      users.add(user);
      user.player = createPlayer();
    },

    get usersCount() {
      return users.size;
    },
    destroy: function destroy() {
      clearInterval(interval);
    }
  };
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createUser = function createUser(socket) {
  return new function User() {
    _classCallCheck(this, User);

    this.socket = socket;
    this.game = null;
    this.player = null;
    this.pointer = null;
  }();
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var findOrCreateGame = function findOrCreateGame() {
  var game = [].concat(_toConsumableArray(games)).find(function (game) {
    return game.usersCount < 2;
  });
  if (!game) {
    game = createGame();
    games.add(game);
  }
  return game;
};

var users = new Set();
var games = new Set();

var index = (function (socket) {
  console.log('connect: ' + socket.id);

  var user = createUser(socket);
  users.add(user);

  var game = findOrCreateGame();
  user.game = game;
  game.addUser(user);

  socket.on("disconnect", function () {
    console.log('disconnect: ' + socket.id);
    users.delete(user);
  });

  socket.on("u:pointer", function (pointer) {
    if (user.game) {
      user.pointer = pointer;
    }
  });
});

module.exports = index;
