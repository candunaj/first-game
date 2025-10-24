export type Game = {
  drawCircle(circle: Circle): void;
  drawRectangle(rectangle: Rectangle): void;
  drawText(text: Text): void;
};

export type Color =
  | "black"
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "orange";

export type Circle = {
  x: number;
  y: number;
  radius: number;
  color?: Color;
};

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: Color;
  angle?: number;
};

export type Text = {
  x: number;
  y: number;
  text: string;
  color?: Color;
  fontSize?: number;
  fontFamily?: string;
  align?: "left" | "center" | "right";
  baseline?: "top" | "middle" | "bottom" | "alphabetic";
  angle?: number;
};

function drawCircle(canvas: HTMLCanvasElement, circle: Circle) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = circle.color || "black";
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawRectangle(canvas: HTMLCanvasElement, rectangle: Rectangle) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = rectangle.color || "black";

  if (rectangle.angle) {
    // Save the current context state
    ctx.save();

    // Translate to the center of the rectangle
    ctx.translate(
      rectangle.x + rectangle.width / 2,
      rectangle.y + rectangle.height / 2
    );

    // Rotate by the specified angle (in degrees, converted to radians)
    ctx.rotate((rectangle.angle * Math.PI) / 180);

    // Draw the rectangle centered at the origin
    ctx.fillRect(
      -rectangle.width / 2,
      -rectangle.height / 2,
      rectangle.width,
      rectangle.height
    );

    // Restore the context state
    ctx.restore();
  } else {
    // No rotation, draw normally
    ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
}

function drawText(canvas: HTMLCanvasElement, text: Text) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = text.color || "black";
  ctx.font = `${text.fontSize || 16}px ${text.fontFamily || "Arial"}`;
  ctx.textAlign = text.align || "left";
  ctx.textBaseline = text.baseline || "alphabetic";

  if (text.angle) {
    // Save the current context state
    ctx.save();

    // Translate to the text position
    ctx.translate(text.x, text.y);

    // Rotate by the specified angle (in degrees, converted to radians)
    ctx.rotate((text.angle * Math.PI) / 180);

    // Draw the text at the origin (since we translated to the position)
    ctx.fillText(text.text, 0, 0);

    // Restore the context state
    ctx.restore();
  } else {
    // No rotation, draw normally
    ctx.fillText(text.text, text.x, text.y);
  }
}

export function createGameFunctions(
  canvas: HTMLCanvasElement | null
): Game | null {
  if (!canvas) {
    return null;
  }
  return {
    drawCircle: (circle: Circle) => drawCircle(canvas, circle),
    drawRectangle: (rectangle: Rectangle) => drawRectangle(canvas, rectangle),
    drawText: (text: Text) => drawText(canvas, text),
  };
}
