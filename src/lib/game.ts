import type { Game } from "./types";

export function init(
  setHeaderText: (text: string) => void,
  width: number,
  height: number,
  log: (message: string) => void
) {
}
export function render(
  game: Game,
  dt: number,
  pressedKeys: Set<string>,
  width: number,
  height: number
) {}
