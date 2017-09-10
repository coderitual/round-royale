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
