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

export const images = assets.reduce((images, asset) => {
  const image = document.createElement('img');
  image.src = asset;
  const imageName = /(\w*)\.svg/g.exec(asset)[1];
  images[imageName] = image;
  return images;
}, {});
