import { Car } from "./components/car/car";
import { Road } from "./components/road/road";

// const car = new Car();
// const road = new Road();

const MAIN_CANVAS_ID = 'mainCanvas';

export class App {
  /* - */

  mainCanvas: HTMLCanvasElement;
  mainCtx: CanvasRenderingContext2D;

  /* - */
  constructor() {
    console.log('Iniciando app...');
    this.orchestrator();
  }

  orchestrator() {
    this.getMainCanvas();
    this.getMainCtx();
    this.testCanvas(this.mainCtx);
    console.log(this.mainCanvas.height)
  }

  getMainCanvas() {
    this.mainCanvas = document.getElementById(MAIN_CANVAS_ID) as HTMLCanvasElement;
  }

  getMainCtx() {
    this.mainCtx = this.mainCanvas.getContext('2d');

  }

  testCanvas(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
  }

}