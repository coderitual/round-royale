const createUser = socket => {
  return new class User {
    socket = socket;
    game = null;
    player = null;
    pointer = null;
  };
};

export { createUser };
