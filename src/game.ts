import { Hex, GameConfig, GameState } from "./game-objects.js";
import { Vector } from "./vector.js";
import { DisplayDriver } from "./display-driver.js";
import { Grid } from "./grid.js";

function elementToScreenCoords(elementP: Vector): Vector {
  return elementP.mul(window.devicePixelRatio).round();
}

export const BASE_CONFIG: GameConfig = {
  hexes: [
    { p: new Vector(0, 0), variant: 0 },
    { p: new Vector(1, 0), variant: 1 },
    { p: new Vector(2, 0), variant: 2 },
    { p: new Vector(2, 1), variant: 1 },
    { p: new Vector(3, 1), variant: 2 },
    { p: new Vector(4, 1), variant: 0 },
    { p: new Vector(2, 2), variant: 1 },
    { p: new Vector(2, 3), variant: 1 },
    { p: new Vector(1, 4), variant: 1 },
    { p: new Vector(0, 4), variant: 1 },
    { p: new Vector(-2, 5), variant: 1 },
    { p: new Vector(-1, 5), variant: 1 },
    { p: new Vector(0, 5), variant: 1 },
    { p: new Vector(-3, 6), variant: 1 },
    { p: new Vector(-2, 6), variant: 1 },
    { p: new Vector(-1, 6), variant: 1 },
    { p: new Vector(-3, 7), variant: 1 },
    { p: new Vector(-2, 7), variant: 1 },
    { p: new Vector(-1, 7), variant: 1 },
    { p: new Vector(-3, 8), variant: 1 },
    { p: new Vector(-2, 8), variant: 1 },
    { p: new Vector(-3, 9), variant: 1 },
  ],

  playerTanks: [
    { id: 1, p: new Vector(-3, 8) },
    { id: 2, p: new Vector(-3, 9) },
  ],

  sites: [
    { p: new Vector(2, 2), variant: 2 },
    { p: new Vector(4, 1), variant: 4 },
    { p: new Vector(-2, 8), variant: 5 },
  ],
};

export class Game {
  grid: Grid;
  displayDriver: DisplayDriver;
  isPointerDown = false;

  constructor(ctx: CanvasRenderingContext2D, config: GameConfig) {
    const gameState = new GameState(config);
    const canvas = ctx.canvas;
    this.initEventListeners(canvas);

    this.displayDriver = new DisplayDriver(ctx, gameState);
    this.grid = new Grid(gameState, this.displayDriver);

    window.addEventListener("resize", () => {
      this.resize();
    });
    this.resize();
  }

  public run() {
    this.draw(0);
  }

  private initEventListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointerdown", (e: PointerEvent) => {
      const screenP = elementToScreenCoords(new Vector(e.offsetX, e.offsetY));
      this.handlePointerStart(screenP);
    });
    canvas.addEventListener("pointerup", (e: PointerEvent) => {
      const screenP = elementToScreenCoords(new Vector(e.offsetX, e.offsetY));
      this.handlePointerEnd(screenP);
    });
    canvas.addEventListener("pointermove", (e: PointerEvent) => {
      const screenP = elementToScreenCoords(new Vector(e.offsetX, e.offsetY));
      this.handlePointerMove(screenP);
    });
    canvas.addEventListener("wheel", (e: WheelEvent) => {
      if (e.deltaY > 0) {
        this.handleZoomOut();
        return;
      }
      this.handleZoomIn();
    });
  }

  private handleZoomIn() {
    this.displayDriver.handleZoomIn();
  }

  private handleZoomOut() {
    this.displayDriver.handleZoomOut();
  }

  private handlePointerStart(p: Vector) {
    this.isPointerDown = true;
    this.grid.handlePointerStart(p);
  }

  private handlePointerEnd(p: Vector) {
    this.isPointerDown = false;
    this.grid.handlePointerEnd(p);
  }

  private handlePointerMove(p: Vector) {
    if (!this.isPointerDown) return;
    this.grid.handlePointerMove(p);
  }

  private draw(curT: number) {
    this.displayDriver.draw();
    this.grid.curT = curT;
    this.grid.tick();
    requestAnimationFrame((t: number) => {
      this.draw(t);
    });
  }

  private resize() {
    this.displayDriver.resize();
  }
}
