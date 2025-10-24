export type Game = {
  drawCircle(circle: Circle): void;
};

export type Circle = {
  x: number;
  y: number;
  radius: number;
};

function drawCircle(canvas: HTMLCanvasElement, circle: Circle) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function createGameFunctions(
  canvas: HTMLCanvasElement | null
): Game | null {
  if (!canvas) {
    return null;
  }
  return {
    drawCircle: (circle: Circle) => drawCircle(canvas, circle),
  };
}
