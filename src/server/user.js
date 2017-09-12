const createUser = (socket, username) => ({
  socket,
  username,
  game: null,
  player: null,
  pointer: {
    x: 0,
    y: 0,
  },
});

export { createUser };
