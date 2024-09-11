import { Graph } from "./components/graph/graph";
import { GraphPoint } from "./components/graph/graph-point";
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

    const p1 =  new GraphPoint(200, 200);
    const p2 =  new GraphPoint(500, 200);
    const p3 =  new GraphPoint(400, 400);
    const p4 =  new GraphPoint(100, 300);

    this.graph = new Graph([p1, p2, p3, p4]);
    this.graph.draw(this.mainCtx);
  }

  getMainCanvas() {
    this.mainCanvas = document.getElementById(MAIN_CANVAS_ID) as HTMLCanvasElement;
  }

  getMainCtx() {
    this.mainCtx = this.mainCanvas.getContext('2d');
  }
}
