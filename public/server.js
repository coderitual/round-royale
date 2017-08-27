'use strict';

const createUser = (socket) => {

};

const users = new Set();

var index = (socket) => {
  console.log("didConnect: " + socket.id);
  const user = createUser(socket);
  users.add(user);

  socket.on("disconnect", function () {
		console.log("didDisconnect: " + socket.id);
    users.delete(user);
	});
};

module.exports = index;
