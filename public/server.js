'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createUser = function createUser(socket) {
  return new function User() {
    _classCallCheck(this, User);

    this.socket = socket;
    this.game = null;
    this.player = null;
  }();
};

var createGame = function createGame() {
  var users = new Set();

  var createPlayer = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0
  };

  var loop = function loop() {};

  var interval = setInterval(loop, 30);
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
    },
    userDataDidReceive: function userDataDidReceive(data) {}
  };
};

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
  console.log("connect: " + socket.id);
  var user = createUser(socket);
  users.add(user);
  var game = findOrCreateGame();

  user.game = game;

  socket.on("disconnect", function () {
    console.log("disconnect: " + socket.id);
    users.delete(user);
  });

  socket.on("player_data", function (data) {
    console.log("player_data");
    console.dir(data);
  });
});

module.exports = index;
