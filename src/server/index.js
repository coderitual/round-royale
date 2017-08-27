const createUser = (socket) => {

};

const createGame = () => {

};

const users = new Set();

export default (socket) => {
  console.log("didConnect: " + socket.id);
  const user = createUser(socket);
  users.add(user);

  socket.on("disconnect", function () {
		console.log("didDisconnect: " + socket.id);
    users.delete(user);
	});
};
