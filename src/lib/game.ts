import type { Game } from "./types";

let xPos = 150;

export function render(game: Game, dt: number, keyCode: string | null) {
  if (keyCode === "ArrowRight") {
    xPos = xPos + 300 * dt;
  }
  if (keyCode === "ArrowLeft") {
    xPos = xPos - 300 * dt;
  }
  drawCar(game, xPos);
}

function drawCar(game: Game, x: number) {
  game.drawText({
    x: x + 20,
    y: 120,
    text: "Fast Car",
    fontSize: 30,
    angle: 20,
  });
  // Car body (main rectangle)
  game.drawRectangle({
    x: x,
    y: 200,
    width: 200,
    height: 60,
    color: "red",
    angle: 0,
  });

  // Car cabin (top rectangle)
  game.drawRectangle({
    x: x + 40,
    y: 150,
    width: 120,
    height: 50,
    color: "red",
  });

  // Left wheel
  game.drawCircle({
    x: x + 50,
    y: 260,
    radius: 25,
    color: "black",
  });

  // Right wheel
  game.drawCircle({
    x: x + 150,
    y: 260,
    radius: 25,
    color: "black",
  });

  // Left wheel hub
  game.drawCircle({
    x: x + 50,
    y: 260,
    radius: 10,
    color: "white",
  });

  // Right wheel hub
  game.drawCircle({
    x: x + 150,
    y: 260,
    radius: 10,
    color: "white",
  });

  // Windows
  game.drawRectangle({
    x: x + 50,
    y: 160,
    width: 40,
    height: 35,
    color: "blue",
  });

  game.drawRectangle({
    x: x + 100,
    y: 160,
    width: 50,
    height: 35,
    color: "blue",
  });
}
