import loop from './loop';

const createPlayer = (userId) => ({
  userId,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
});

const createGame = ({ name, maxUsersCount = 2 } = {}) => {
  const users = new Set();

  const update = (dt) => {
    users.forEach(user => {
      const { player, pointer } = user;
      if(!pointer) {
        return;
      }
      player.ax = (pointer.x - pointer.cw / 2);
      player.ay = (pointer.y - pointer.ch / 2);

      // Dead zone
      const deadZone = 10;
      if(Math.abs(player.ax) < deadZone) {
        player.ax = 0;
      } else {
        if(player.ax > 0) player.ax -= deadZone;
        if(player.ax < 0) player.ax += deadZone;
      }

      if(Math.abs(player.ay) < deadZone) {
        player.ay = 0;
      } else {
        if(player.ay > 0) player.ay -= deadZone;
        if(player.ay < 0) player.ay += deadZone;
      }

      player.vx += player.ax * dt / 1000;
      player.vy += player.ay * dt / 1000;

      player.vx *= 0.98;
      player.vy *= 0.98;

      player.x += player.vx * dt / 100;
      player.y += player.vy * dt / 100;
    });
  };

  const sync = () => {
    users.forEach(currentUser => {
      const others =
        [...users]
          .filter(user => user !== currentUser)
          .map(user => ({
            x: user.player.x,
            y: user.player.y,
            id: user.socket.id,
            username: user.username,
          }));

      const me = {
        x: currentUser.player.x,
        y: currentUser.player.y,
        id: currentUser.socket.id,
        me: true
      };

      currentUser.socket.emit('s:players', { me, others });
    });
  }

  const destroy = loop((dt) => {
    update(dt);
    sync();
  });

  return {
    maxUsersCount,
    addUser(user) {
      users.add(user);
      user.player = createPlayer(user.socket.id);
    },
    get usersCount() {
      return users.size;
    },
    destroy() {
      clearInterval(interval);
    }
  }
};

export { createGame };
