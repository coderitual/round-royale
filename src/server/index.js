import { createGame } from './game';
import { createUser } from './user';

const findOrCreateGame = () => {
  let game = [...games].find(game => game.usersCount < game.maxUsersCount);
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
