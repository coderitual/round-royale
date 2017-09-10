import { images } from './assets';

export const clear = (context, width, height) => {
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
  context.fillStyle = "#2c5b1e";
  context.fillRect(0, 0, width, height);
}

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
  context.strokeStyle = "#513213";
  context.lineWidth   = 2;
  context.shadowColor = "#000";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.setLineDash([10,5]);
  trees.forEach(({ x, y, r}) => {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.stroke();
  });
  context.restore();
};

export const drawHoles = (context, holes) => {
  context.save();
  context.strokeStyle = "#e3301a";
  context.lineWidth   = 2;
  context.shadowColor = "#000";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  context.setLineDash([10,5]);
  holes.forEach(({ x, y, r}) => {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.stroke();
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
}

export const drawOtherPlayers = (context, players) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.7)";
  context.font = 'bold 12px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 1;
  players.forEach((player) => {
    context.drawImage(images.eye, player.x - images.eye.width / 2, player.y - images.eye.height / 2);
    context.fillText(player.username,  player.x, player.y + 15);
  });
  context.restore();
}

export const drawPointer = (context, x, y) => {
  context.save();
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI, false);
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.stroke();
  context.restore();
};

export const drawDebugInfo = (context, info) => {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 1)";
  context.font = '12px sans-serif';
  context.textAlign = 'start';
  context.textBaseline = 'top';
  Object.entries(info).forEach(([key, value], index) => {
    context.fillText(`${key}: ${value}`, 10, 10 + index * 15);
  });
  context.restore();
};
