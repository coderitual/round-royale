import { images } from './assets';
export { assetsReady } from './assets';

const range = (count) => new Array(count).fill();

export const clear = (context, width, height) => {
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
  context.fillStyle = "#2c5b1e";
  context.fillRect(0, 0, width, height);
};

export const drawWorld = (context, world) => {
  context.save();
  context.strokeStyle = "#fff";
  context.lineWidth   = 5;
  context.shadowColor = "#000";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.setLineDash([10,5]);
  context.strokeRect(0, 0, world.width, world.height);
  context.restore();
};

export const drawTrees = (context, trees) => {
  context.save();
  context.setLineDash([10,5]);
  trees.forEach(({ x, y, r}) => {
    const factor = (2 * r) / images.tree.width;
    const width = images.tree.width * factor;
    const height = images.tree.height * factor;
    context.drawImage(images.tree, x - r, y - r - (height - 2 * r), width, height);
  });
  context.restore();
};

export const drawHoles = (context, holes) => {
  context.save();
  holes.forEach(({ x, y, r}) => {
    const xfactor = (2 * r) / images.hole.width;
    const yfactor =  (2 * r) / images.hole.height;
    const width = images.hole.width * xfactor;
    const height = images.hole.height * yfactor;
    context.drawImage(images.hole, x - r, y - r, width, height);
  });
  context.restore();
};

const playerSprite = [images.eye, images.eye, images.eye, images.eye, images.eye_closed];
export const drawPlayer = (context, x, y, time) => {
  const sprite = playerSprite[Math.round(time / 500) % 5];
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.7)";
  context.font = 'bold 12px sans-serif';
  context.textAlign = 'center';
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 2;
  context.drawImage(sprite,  x - sprite.width / 2, y - sprite.height / 2);
  context.restore();
};

export const drawOtherPlayers = (context, players) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.7)";
  context.font = 'bold 12px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.shadowColor = "rgba(0, 0, 0, 1)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  players.forEach(({ x, y, username, position, health, projectiles }) => {
    context.drawImage(images.eye, x - images.eye.width / 2, y - images.eye.height / 2);
    context.fillText(`${username}`,  x, y + 15);
    context.font = 'bold 9px sans-serif';
    context.fillText(`🏆 ${position}  ❤️ ${health}  🔫 ${projectiles}`,  x, y + 30);
  });
  context.restore();
};

export const drawProjectiles = (context, projectiles) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 1)";
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  projectiles.forEach(({ x, y }) => {
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI, false);
    context.fill();
  });
  context.restore();
};

export const drawPointer = (context, x, y) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 2;
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI, false);
  context.stroke();
  context.restore();
};

export const drawPlayerHealth = (context, x, y, health) => {
  context.save();
  range(health).forEach((_, index) => {
    const scale = 0.7;
    const { width, height } = images.heart;
    context.drawImage(images.heart, x + width * scale * index, y, width * scale, height * scale);
  });
  context.restore();
};

export const drawPlayerProjectiles = (context, x, y, projectiles) => {
  context.save();
  range(projectiles).forEach((_, index) => {
    const scale = 0.7;
    const { width, height } = images.projectile;
    context.drawImage(images.projectile, x + width * scale * index, y, width * scale, height * scale);
  });
  context.restore();
};

export const drawDebugInfo = (context, x, y, info) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.4)";
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.shadowColor = "rgba(0, 0, 0, 1)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 2;
  context.font = 'bold 10px sans-serif';
  context.textAlign = 'start';
  context.textBaseline = 'top';
  Object.entries(info).forEach(([key, value], index) => {
    context.fillText(`${key}: ${value}`, x, y + index * 12);
  });
  context.restore();
};

export const drawPlayerList = (context, x, y, players) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.4)";
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.shadowColor = "rgba(0, 0, 0, 1)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 2;
  context.font = 'bold 10px sans-serif';
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  [...players].forEach(([_, { username, position, health, projectiles }], index) => {
    context.fillText(`${username} - 🏆 ${position}  ❤️ ${health}  🔫 ${projectiles}`,  x, y + index * -12);
  });
  context.restore();
};

export const drawGameInfo = (context, x, y, info) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.9)";
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.shadowColor = "rgba(0, 0, 0, 1)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.font = 'bold 14px sans-serif';
  context.textAlign = 'end';
  context.textBaseline = 'top';
  Object.entries(info).forEach(([key, value], index) => {
    context.fillText(`${key}: ${value}`, x, y + index * 14);
  });
  context.restore();
};
