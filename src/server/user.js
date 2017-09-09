const createUser = (socket, username) => ({
  socket,
  username,
  game: null,
  player: null,
  pointer: null,
});

export { createUser };
