import { Graph } from "./components/graph/graph";
import { MAIN_CANVAS_ID } from "./config/app.config";

export class App {
  /* - */
  mainCanvas: HTMLCanvasElement;
  mainCtx: CanvasRenderingContext2D;

  graph: Graph;

  constructor() {
    console.log('Iniciando app...👌');
    if (typeof document === 'undefined') {
      return;
    }
    this.orchestrator();
    


  }

  orchestrator() {
    this.getMainCanvas();
    this.getMainCtx();

    this.mainCanvas.width = 600;
    this.mainCanvas.height = 600;

    this.graph = new Graph();
    this.graph.draw(this.mainCtx);
  }

  getMainCanvas() {
    this.mainCanvas = document.getElementById(MAIN_CANVAS_ID) as HTMLCanvasElement;
  }

  getMainCtx() {
    this.mainCtx = this.mainCanvas.getContext('2d');
  }
}
