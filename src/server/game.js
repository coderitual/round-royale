import loop from './loop';

const createPlayer = (userId, x, y) => ({
  userId,
  x,
  y,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
});

const createWorld = (width, height) => ({
  width,
  height,
});

const createGame = ({ name, maxUsersCount = 2 } = {}) => {
  const users = new Set();
  const world = createWorld(2000, 2000);

  const update = (dt) => {
    // Players position calculation
    users.forEach(({ player, pointer }) => {
      if(!pointer) {
        return;
      }
      player.ax = (pointer.x - pointer.cw / 2);
      player.ay = (pointer.y - pointer.ch / 2);

      // Dead zone
      const deadZone = 8;
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

      const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      const maxSpeed = 30;
      if(speed > maxSpeed) {
        const factor = speed / maxSpeed;
        player.vx /= factor;
        player.vy /= factor;
      }

      player.vx *= 0.98;
      player.vy *= 0.98;

      player.x += player.vx * dt / 100;
      player.y += player.vy * dt / 100;
    });

    // World boundary players collision
    users.forEach(({ player }) => {
      if(player.x < 0) {
        player.x = 0;
        player.ax *= -1;
        player.vx *= -1;
      } else if (player.x > world.width) {
        player.x = world.width;
        player.ax *= -1;
        player.vx *= -1;
      }
      if(player.y < 0) {
        player.y = 0;
        player.ay *= -1;
        player.vy *= -1;
      } else if (player.y > world.height) {
        player.y = world.height;
        player.ay *= -1;
        player.vy *= -1;
      }
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

      currentUser.socket.emit('s:players:update', { me, others });
      currentUser.socket.emit('s:world:update', world);
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
      user.player = createPlayer(user.socket.id, 500, 500);
    },
    removeUser(user) {
      users.delete(user);
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
