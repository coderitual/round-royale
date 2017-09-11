const assets = [
  'assets/hole.svg',
  'assets/stamp.svg',
  'assets/tree.svg',
  'assets/eye.svg',
  'assets/stamp2.svg',
  'assets/eye_closed.svg',
  'assets/heart.svg',
  'assets/projectile.svg',
  'assets/arrow.svg',
  'assets/powerup.svg',
];


let assetsLoaded = 0;

export const images = assets.reduce((images, asset) => {
  const image = document.createElement('img');
  image.src = asset;
  image.addEventListener('load', () => {
    assetsLoaded++;
  });
  const imageName = /(\w*)\.svg/g.exec(asset)[1];
  images[imageName] = image;
  return images;
}, {});

export const assetsReady = () => assetsLoaded === assets.length;
