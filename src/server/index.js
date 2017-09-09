import { createGame } from './game';
import { createUser } from './user';

const users = new Set();
const games = new Set();

const findOrCreateGame = () => {
  let game = [...games].find(game => game.usersCount < game.maxUsersCount);
  if(!game) {
    game = createGame({ name: `Game ${games.size}`});
    games.add(game);
  }
  return game;
}

export default socket => {
  console.log(`connect: ${socket.id}`);

  const { username  = `Guest ${users.size}` } = socket.handshake.query;
  const user = createUser(socket, username);
  users.add(user);

  const game = findOrCreateGame();
  user.game = game;
  game.addUser(user);

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
    users.delete(user);
  });

  socket.on("c:pointer", pointer => {
    if(user.game) {
      user.pointer = pointer;
    }
  });
};
