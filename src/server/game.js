import loop from './loop';

const range = (count) => new Array(count).fill();

const createPlayer = (x = 0, y = 0) => ({
  x,
  y,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  r: 18,
  kills: 0,
  points: 0,
  deaths: 0,
  position: 1,
  health: 5,
  projectiles: 0,
  maxProjectiles: 2,
});

let projectileId = 0;
const createProjectile = (player, x, y, vx, vy, TTL = 1500) => ({
  id: projectileId++,
  player,
  x,
  y,
  vx,
  vy,
  r: 5,
  created: Date.now(),
  TTL,
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

  const SIZE = 400;
  range(Math.floor(width / SIZE)).forEach((_, sx) => {
    range(Math.floor(height / SIZE)).forEach((_, sy) => {
      const random = Math.random();
      if (random <= 0.3) {
        const radius = Math.random() * (SIZE / 3 - 50) + 50;
        const space = SIZE - 2 * radius;
        const x = Math.random() * space;
        const y = Math.random() * space;
        world.trees.add(createTree(x + SIZE * sx + radius, y + SIZE * sy + radius, radius));
      } else if (random < 0.9) {
        const radius = Math.random() * (SIZE / 3 - 50) + 50;
        const space = SIZE - 2 * radius;
        const x = Math.random() * space;
        const y = Math.random() * space;
        world.holes.add(createHole(x + SIZE * sx + radius, y + SIZE * sy + radius, radius));
      }
    });
  });

  return world;
};

const createGame = ({ name, maxUsersCount = 6 } = {}) => {
  const users = new Set();
  const world = createWorld(2000, 2000);
  let projectiles = new Set();

  const killProjectile = (projectile) => {
    projectile.player.projectiles--;
    projectiles.delete(projectile);
  };

  const killPlayer = (player) => {
    player.deaths++;
    player.health = 5;
    player.points = 0;
    player.maxProjectiles = 1;
    resetPlayerPosition(player);
  };

  const awardPlayer = (player) => {
    player.kills++;
    player.points++;
    const bonus = Math.random();
    if (bonus > 0.5) {
      player.health++;
    } else {
      player.maxProjectiles++;
    }
  };

  const resetPlayerPosition = (player) => {
    let positionFound = false;
    while (!positionFound) {
      player.x = Math.random() * world.width;
      player.y = Math.random() * world.height;
      positionFound = ![...world.trees, ...world.holes].some(({ x, y, r }) => {
        const dx = player.x - x;
        const dy = player.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < r + player.r) {
          return true;
        }
        return false;
      });
    }
  };

  const update = (dt, time = Date.now()) => {
    // Players position calculation
    users.forEach(({ player, pointer }) => {
      player.ax = pointer.x;
      player.ay = pointer.y;

      // Dead zone
      const deadZone = 20;
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
      const maxSpeed = 25;
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

    const projectilesToKill = new Set([...projectiles].filter(projectile => {
      return time - projectile.created >= projectile.TTL;
    }));

    projectilesToKill.forEach(killProjectile);

    projectiles.forEach(projectile => {
      projectile.x += projectile.vx * dt / 100;
      projectile.y += projectile.vy * dt / 100;
    });

    // Projectiles vs players collision
    projectiles.forEach(projectile => {
      users.forEach(({ player }) => {
        if (projectile.player === player) {
          return;
        }
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < projectile.r + player.r) {
          player.health--;
          killProjectile(projectile);
          if(player.health === 0) {
            killPlayer(player);
            awardPlayer(projectile.player);
          }
        }
      });
    });

    // Projectiles vs trees collision
    projectiles.forEach(projectile => {
      world.trees.forEach((tree) => {
        const dx = projectile.x - tree.x;
        const dy = projectile.y - tree.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < projectile.r + tree.r) {
          killProjectile(projectile);
        }
      });
    });

    // Players vs trees collision
    users.forEach(({ player }) => {
      world.trees.forEach((tree) => {
        const dx = player.x - tree.x;
        const dy = player.y - tree.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const vx = dx / distance;
        const vy = dx / distance;
        if (distance < player.r + tree.r) {
          player.x -= player.vx * dt / 100;
          player.y -= player.vy * dt / 100;
          player.vx *= -1;
          player.vy *= -1;
          player.ax *= -1;
          player.ay *= -1;
        }
      });
    });

    // Players vs holes collision
    users.forEach(({ player }) => {
      world.holes.forEach((hole) => {
        const dx = player.x - hole.x;
        const dy = player.y - hole.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const vx = dx / distance;
        const vy = dx / distance;
        if (distance < hole.r) {
          killPlayer(player);
        }
      });
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

    // Calculate players position
    [...users]
    .sort((a, b) => b.player.points - a.player.points)
    .forEach(({ player }, index) => { player.position = index + 1});
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
          kills: user.player.kills,
          deaths: user.player.deaths,
          points: user.player.points,
          position: user.player.position,
          health: user.player.health,
          projectiles: user.player.maxProjectiles - user.player.projectiles,
        }));
      const me = {
        x: currentUser.player.x,
        y: currentUser.player.y,
        id: currentUser.socket.id,
        kills: currentUser.player.kills,
        deaths: currentUser.player.deaths,
        points: currentUser.player.points,
        position: currentUser.player.position,
        health: currentUser.player.health,
        projectiles: currentUser.player.maxProjectiles - currentUser.player.projectiles,
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
      user.player = createPlayer();
      resetPlayerPosition(user.player);
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
        if (user.player.projectiles === user.player.maxProjectiles) {
          return;
        }

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
        projectiles.add(createProjectile(user.player, x, y, vx, vy));
        user.player.projectiles++;
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
