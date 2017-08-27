const createUser = socket => {};

const createGame = () => {};

const users = new Set();

export default socket => {
  console.log(`connect: ${socket.id}`);
  const user = createUser(socket);
  users.add(user);

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
    users.delete(user);
  });

  socket.on("player_data", data => {
    console.log("player_data");
    console.dir(data);
  });
};
