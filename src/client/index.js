import assets from './assets';
console.log(assets);

const img = document.createElement('img');
img.src = assets.hole;
img.addEventListener('load', () => {
  const { width, height } = img;
  console.log({ width, height });
});

const stamp = document.createElement('img');
stamp.src = assets.stamp;
stamp.addEventListener('load', () => {
  const { width, height } = stamp;
  console.log({ width, height });
})

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

const initGfx = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
};

window.addEventListener("resize", initGfx);
initGfx();

let socket;
if(window.location.port === '8080') {
  socket = io(`${window.location.hostname}:3000`, { upgrade: false, transports: ["websocket"] });
} else {
  socket = io({ upgrade: false, transports: ["websocket"] });
}

const scene = {
  player
};

const render = scene => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "#2c5b1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0,0, 200, 200);
  ctx.drawImage(img, 300,200, 100, 100);

  ctx.globalCompositeOperation = 'soft-light';
  ctx.drawImage(stamp, -100, -200, 500, 500);

  ctx.globalCompositeOperation = 'source-over';

  ctx.beginPath();
  ctx.arc(scene.player.x, scene.player.y, 20, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#40b4c0";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#333";
  ctx.stroke();
};

const loop = dt => {
  requestAnimationFrame(loop);
  render(scene);
};

window.addEventListener("deviceorientation", event => {
  let x = event.beta; // In degree in the range [-180,180]
  let y = event.gamma; // In degree in the range [-90,90]

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  player.x = canvas.width * y / 180 - 10;
  player.y = canvas.height * x / 180 - 10;
  socket.emit('player_data', player);
});

loop();
