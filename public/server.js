'use strict';

const createUser = socket => {};

const users = new Set();

var index = socket => {
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

module.exports = index;
