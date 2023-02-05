import Car from './car.js';
import NeuralNetwork from './network.js';
import Road from './road.js';
import Visualizer from './visualizer.js';

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateCars(N);

const BEST_BRAIN_KEY = 'bestBrain';

let bestCar = cars[0];
let bestBrain = localStorage.getItem(BEST_BRAIN_KEY);
if (localStorage.getItem(BEST_BRAIN_KEY)) {
  let parsedBestBrain = JSON.parse(bestBrain);
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem(BEST_BRAIN_KEY));
    if(i!= 0){
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
  // bestCar = cars[0];
}

// const car = new Car(road.getLaneCenter(2), 100, 30, 50, 'AI');

// window['car'] = car;

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
];

// car.draw(carCtx);

animate();

function save() {
  localStorage.setItem(BEST_BRAIN_KEY, JSON.stringify(bestCar.brain))
}

function discard() {
  localStorage.removeItem(BEST_BRAIN_KEY);
}

function generateCars(n) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }
  return cars;
}

function animate(time) {

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find(c => c.y == Math.min(
    ...cars.map(c => c.y)
  ));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}

window.appContext = { ctx: carCtx, road, bestCar, save, discard };