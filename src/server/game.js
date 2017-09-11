import loop from './loop';

const range = (count) => new Array(count).fill();

const createPlayer = (x, y) => ({
  x,
  y,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
});

let projectileId = 0;
const createProjectile = (x, y, vx, vy) => ({
  id: projectileId++,
  x,
  y,
  vx,
  vy,
  created: Date.now(),
  TTL: 1000,
});

const createTree = (x, y, r) => ({ x, y, r });
const createHole = (x, y, r) => ({ x, y, r });
const createWorld = (width, height) => {
  const world = {
    width,
    height,
    trees: new Set(),
    holes: new Set(),
  };

  const SIZE = 300;
  range(Math.floor(width / SIZE)).forEach((_, sx) => {
    range(Math.floor(height / SIZE)).forEach((_, sy) => {
      const random = Math.random();
      if (random <= 0.3) {
        const radius = Math.random() * (SIZE / 3 - 50) + 50;
        const space = SIZE - 2 * radius;
        const x = Math.random() * space;
        const y = Math.random() * space;
        world.trees.add(createTree(x + SIZE * sx, y + SIZE * sy, radius));
      } else if (random > 0.3 && random < 0.6) {
        const radius = Math.random() * (SIZE / 3 - 50) + 50;
        const space = SIZE - 2 * radius;
        const x = Math.random() * space;
        const y = Math.random() * space;
        world.holes.add(createHole(x + SIZE * sx, y + SIZE * sy, radius));
      }
    })
  })

  return world;
};

const createGame = ({ name, maxUsersCount = 6 } = {}) => {
  const users = new Set();
  const world = createWorld(2000, 2000);
  let projectiles = new Set();

  const update = (dt, time = Date.now()) => {
    // Players position calculation
    users.forEach(({ player, pointer }) => {
      if (!pointer) {
        return;
      }
      player.ax = pointer.x;
      player.ay = pointer.y;

      // Dead zone
      const deadZone = 15;
      if (Math.abs(player.ax) < deadZone) {
        player.ax = 0;
      } else {
        if (player.ax > 0) player.ax -= deadZone;
        if (player.ax < 0) player.ax += deadZone;
      }

      if (Math.abs(player.ay) < deadZone) {
        player.ay = 0;
      } else {
        if (player.ay > 0) player.ay -= deadZone;
        if (player.ay < 0) player.ay += deadZone;
      }

      player.vx += player.ax * dt / 1000;
      player.vy += player.ay * dt / 1000;

      const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      const maxSpeed = 20;
      if (speed > maxSpeed) {
        const factor = speed / maxSpeed;
        player.vx /= factor;
        player.vy /= factor;
      }

      player.vx *= 0.98;
      player.vy *= 0.98;

      player.x += player.vx * dt / 100;
      player.y += player.vy * dt / 100;
    });


    projectiles = new Set([...projectiles].filter(projectile => {
      return time - projectile.created < projectile.TTL;
    }));

    projectiles.forEach(projectile => {
      projectile.x += projectile.vx * dt / 100;
      projectile.y += projectile.vy * dt / 100;
    });

    // World boundary players collision
    users.forEach(({ player }) => {
      if (player.x < 0) {
        player.x = 0;
        player.ax *= -1;
        player.vx *= -1;
      } else if (player.x > world.width) {
        player.x = world.width;
        player.ax *= -1;
        player.vx *= -1;
      }
      if (player.y < 0) {
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
      const others = [...users]
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

      const projectilesData = [...projectiles]
        .map(({ id, x, y }) => ({ id, x, y }));
      currentUser.socket.emit('s:projectiles:update', projectilesData);
    });
  };

  const destroy = loop((dt) => {
    update(dt);
    sync();
  });

  return {
    maxUsersCount,
    destroy,
    addUser(user) {
      users.add(user);
      user.player = createPlayer(500, 500);
      user.socket.emit('s:world:create', {
        width: world.width,
        height: world.height,
        holes: [...world.holes],
        trees: [...world.trees],
      });
      user.socket.on("c:pointer:update", pointer => {
        user.pointer = pointer;
      });
      user.socket.on("c:fire:pressed", () => {
        const x = user.player.x;
        const y = user.player.y;
        let vx = user.pointer.x;
        let vy = user.pointer.y;
        const speed = Math.sqrt(vx * vx + vy * vy);
        vx /= speed;
        vy /= speed;

        const newSpeed = 60;
        vx *= newSpeed;
        vy *= newSpeed;
        projectiles.add(createProjectile(x, y, vx, vy));
      });
    },
    removeUser(user) {
      users.delete(user);
    },
    get usersCount() {
      return users.size;
    },
  }
};

export { createGame };
