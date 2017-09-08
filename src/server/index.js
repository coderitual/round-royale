
const createUser = socket => {
  return new class User {
    socket = socket;
    game = null;
    player = null;
  };
};

const createGame = () => {
  const users = new Set();

  const createPlayer = ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0
  });

  const loop = () => {

  }

  const interval = setInterval(loop, 30);
  const destroy = () => clearInterval(interval);

  return {
    addUser(user) {
      users.add(user);
      user.player = createPlayer();
    },
    get usersCount() {
      return users.size;
    },
    destroy() {
      clearInterval(interval);
    },
    userDataDidReceive(data) {

    }
  }
};

const findOrCreateGame = () => {
  let game = [...games].find(game => game.usersCount < 2);
  if(!game) {
    game = createGame();
    games.add(game);
  }
  return game;
}

const users = new Set();
const games = new Set();

export default socket => {
  console.log(`connect: ${socket.id}`);
  const user = createUser(socket);
  users.add(user);
  const game = findOrCreateGame();

  user.game = game;

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
    users.delete(user);
  });

  socket.on("player_data", data => {
    console.log("player_data");
    console.dir(data);
  });
};
