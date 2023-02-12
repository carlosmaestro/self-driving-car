import { Car } from "./components/car/car";
import NeuralNetwork from "./components/network/network";
import { Visualizer } from "./components/network/visualizer";
import { Road } from "./components/road/road";
import { BEST_BRAIN_KEY, MAIN_CANVAS_ID, NERTWORK_CANVAS_ID, NUMBER_OF_CARS } from "./config/app.config";
import { CarControlType } from "./enums/car-control-type.enum";
import { getRandomColor, getRandomInt } from "./utils/utils";

// const car = new Car();
// const road = new Road();



export class App {
  /* - */

  mainCanvas: HTMLCanvasElement;
  mainCtx: CanvasRenderingContext2D;

  networkCanvas: HTMLCanvasElement;
  networkCtx: CanvasRenderingContext2D;

  road: Road;

  cars?: Car[];
  traffic?: Car[];

  N: number;
  bestCar?: Car;
  bestBrain?: Car;

  pausedProcessors: boolean;
  /* - */
  constructor() {
    console.log('Iniciando app...');
    this.cars = [];
    this.traffic = [];
    this.N = NUMBER_OF_CARS;
    this.pausedProcessors = false;
    this.orchestrator();

    let w = window as any;
    w["appContext"] = this;
  }

  orchestrator() {
    this.getMainCanvas();
    this.getMainCtx();
    this.getNetworkCanvas();
    this.getNetworkCtx();
    // this.testCanvas(this.mainCtx);

    this.road = new Road({ anchor: { x: this.mainCanvas.width / 2 }, width: this.mainCanvas.width * 0.9 });

    this.cars = this.generateCars(this.N);

    this.loadLastResult();

    // this.cars.push(new Car({ anchor: { x: 100, y: 700 }, controlType: CarControlType.AI, drawSensor: true }));
    console.log(this);

    console.log(this.mainCanvas.height);

    this.traffic = [
      // new Car({ anchor: { x: this.road.getLaneCenter(getRandomInt(3.999)), y: -100 }, controlType: CarControlType.DUMMY, color: getRandomColor() }),
      new Car({ anchor: { x: this.road.getLaneCenter(0), y: -1000 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(1), y: -900 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(2), y: -900 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(3), y: -700 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(0), y: -450 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(1), y: -200 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(3), y: 100 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
      new Car({ anchor: { x: this.road.getLaneCenter(2), y: 400 }, controlType: CarControlType.DUMMY, color: getRandomColor(), maxSpeed: 2 }),
    ];

    this.animate();
  }

  loadLastResult() {
    if (localStorage.getItem(BEST_BRAIN_KEY)) {
      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].brain = JSON.parse(localStorage.getItem(BEST_BRAIN_KEY));
        if (i != 0) {
          NeuralNetwork.mutate(this.cars[i].brain, 0.2);
        }
      }
      // bestCar = cars[0];
    }
  }

  pauseProcesses() {
    this.pausedProcessors = true;
  }

  restoreProcesses() {
    this.pausedProcessors = false;
  }

  saveState() {
    localStorage.setItem(BEST_BRAIN_KEY, JSON.stringify(this.bestCar.brain))
  }

  discardState() {
    localStorage.removeItem(BEST_BRAIN_KEY);
  }

  generateCars(n: number) {
    const cars = [];
    for (let i = 0; i < n; i++) {
      cars.push(new Car({ anchor: { x: this.road.getLaneCenter(2), y: 700 }, controlType: CarControlType.AI }));
    }
    return cars;
  }

  getMainCanvas() {
    this.mainCanvas = document.getElementById(MAIN_CANVAS_ID) as HTMLCanvasElement;
  }

  getMainCtx() {
    this.mainCtx = this.mainCanvas.getContext('2d');
  }

  getNetworkCanvas() {
    this.networkCanvas = document.getElementById(NERTWORK_CANVAS_ID) as HTMLCanvasElement;
  }

  getNetworkCtx() {
    this.networkCtx = this.networkCanvas.getContext('2d');
  }

  animate(time?: number) {
    if (!this.pausedProcessors) {

      // console.log(time);

      for (let i = 0; i < this.traffic.length; i++) {
        this.traffic[i].update(this.road.borders, []);
      }

      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].update(this.road.borders, this.traffic);
      }

      this.bestCar = this.cars.find(c => c.anchor.y == Math.min(
        ...this.cars.map(c => c.anchor.y)
      ));

      this.mainCanvas.height = window.innerHeight;
      this.networkCanvas.height = window.innerHeight;
      this.mainCtx.save();

      // movimento camera
      this.mainCtx.translate(0, -this.bestCar.anchor.y + this.mainCanvas.height * 0.7);

      this.road.draw(this.mainCtx);

      for (let i = 0; i < this.traffic.length; i++) {
        this.traffic[i].draw(this.mainCtx);
      }

      this.mainCtx.globalAlpha = 0.2;

      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].draw(this.mainCtx);
      }

      this.mainCtx.globalAlpha = 1;

      this.bestCar.draw(this.mainCtx, true);

      this.mainCtx.restore();

      this.networkCtx.lineDashOffset = -time / 50;
      Visualizer.drawNetwork(this.networkCtx, this.bestCar.brain);
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