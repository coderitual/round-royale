import { createGame } from './game';
import { createUser } from './user';

const users = new Set();
const games = new Set();

let userId = 0;
let gameId = 0;

const findOrCreateGame = () => {
  let game = [...games].find(game => game.usersCount < game.maxUsersCount);
  if(!game) {
    game = createGame({ name: `Game ${gameId++}`});
    games.add(game);
  }
  return game;
}

export default socket => {
  console.log(`connect: ${socket.id}`);

  const { username  = `Guest ${userId++}` } = socket.handshake.query;
  console.log(username)
  const user = createUser(socket, username);
  users.add(user);

  const game = findOrCreateGame();
  user.game = game;
  game.addUser(user);

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
    users.delete(user);
    user.game.removeUser(user);
  });

  socket.on("c:pointer", pointer => {
    if(user.game) {
      user.pointer = pointer;
    }
  });
};
