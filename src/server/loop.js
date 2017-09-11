export default (func, delay = 15) => {
  let lastUpdate = Date.now();
  const loop = () => {
    const now = Date.now();
    const dt = now - lastUpdate;
    func(dt);
    lastUpdate = now;
  }

  const intervalID = setInterval(loop, delay);
  return () => clearInterval(intervalID);
}
