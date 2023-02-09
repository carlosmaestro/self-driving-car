import { Car } from "./components/car/car";
import { Road } from "./components/road/road";
import { CarControlType } from "./enums/car-control-type.enum";

// const car = new Car();
// const road = new Road();

const MAIN_CANVAS_ID = 'mainCanvas';

export class App {
  /* - */

  mainCanvas: HTMLCanvasElement;
  mainCtx: CanvasRenderingContext2D;

  road: Road;

  cars?: Car[];
  traffic?: Car[];
  /* - */
  constructor() {
    console.log('Iniciando app...');
    this.cars = [];
    this.traffic = [];
    this.orchestrator();
  }

  orchestrator() {
    this.getMainCanvas();
    this.getMainCtx();
    // this.testCanvas(this.mainCtx);

    this.road = new Road({ anchor: { x: this.mainCanvas.width / 2 }, width: this.mainCanvas.width * 0.9 });

    this.cars.push(new Car({ anchor: { x: 100, y: 200 }, width: 30, height: 50, maxSpeed: 3, controlType: CarControlType.KEYS }));
    console.log(this);

    console.log(this.mainCanvas.height);

    this.animate();
  }

  getMainCanvas() {
    this.mainCanvas = document.getElementById(MAIN_CANVAS_ID) as HTMLCanvasElement;
  }

  getMainCtx() {
    this.mainCtx = this.mainCanvas.getContext('2d');
  }

  animate(time?: number) {
    // console.log(time);

    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].update(this.road.borders, this.traffic);
    }

    this.mainCanvas.height = window.innerHeight;
    this.mainCtx.save();
    this.road.draw(this.mainCtx);
    for (let i = 0; i < this.cars.length; i++) {

      this.cars[i].draw(this.mainCtx);
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  testCanvas(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.fillRect(10, 10, 150, 80);
    ctx.stroke();
  }

}