import { CAR_ACCELERATION, CAR_BREAK_MULTIPLIER, CAR_COLOR, CAR_DRAW_SENSOR, CAR_FRICTION, CAR_HEIGHT, CAR_IMAGE_SRC, CAR_MAX_SPEED, CAR_WIDTH, NETWORK_INPUT_COUNT, NETWORK_OUTPUT_COUNT } from '../../config/car.config';
import { CarControlType } from '../../enums/car-control-type.enum';
import { Border } from '../../models/border';
import { Drawable, IDrawable } from '../../models/drawable';
import { Point } from '../../models/point';
import { getValueOrDefault, polysIntersect } from '../../utils/utils';
import NeuralNetwork from '../network/network';
import { CarControls } from './controls';
import { Sensor } from './sensor';

export interface ICar extends IDrawable {
  speed?: number;
  acceleration?: number;
  maxSpeed?: number;
  friction?: number;
  useBrain?: boolean;
  controlType?: CarControlType;
  controls?: CarControls;
  damaged?: boolean;
  polygon?: Point[];
  sensor?: Sensor;
  drawSensor?: boolean;
  color?: string;
  mask?: HTMLCanvasElement;
  img?: HTMLImageElement;
  brain?: NeuralNetwork;
}

export class Car extends Drawable implements ICar {
  speed?: number;
  acceleration?: number;
  maxSpeed?: number;
  friction?: number;
  useBrain?: boolean;
  controlType: CarControlType;
  controls: CarControls;
  damaged?: boolean;
  polygon?: Point[];
  sensor?: Sensor;
  drawSensor?: boolean;
  color?: string;
  mask?: HTMLCanvasElement;
  img?: HTMLImageElement;
  brain?: NeuralNetwork;

  constructor(data?: ICar) {
    data.width = data.width || CAR_WIDTH;
    data.height = data.height || CAR_HEIGHT;

    super(data);

    const { speed,
      acceleration,
      maxSpeed,
      friction,
      controlType,
      damaged,
      width,
      height,
      drawSensor,
      color,
    } = data;

    this.speed = speed || 0;
    this.acceleration = acceleration || CAR_ACCELERATION;
    this.maxSpeed = maxSpeed || CAR_MAX_SPEED;
    this.friction = friction || CAR_FRICTION;
    this.controlType = getValueOrDefault(controlType, CarControlType.DUMMY);

    this.controls = new CarControls(controlType);

    this.useBrain = controlType == CarControlType.AI;

    if (this.controlType != CarControlType.DUMMY) {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, NETWORK_INPUT_COUNT, NETWORK_OUTPUT_COUNT]
      );
    }

    this.drawSensor = drawSensor || CAR_DRAW_SENSOR;

    this.damaged = damaged || false;

    // todo separar contexto
    this.img = new Image();
    this.img.src = CAR_IMAGE_SRC;
    this.mask = document.createElement('canvas');
    this.mask.width = width;
    this.mask.height = height;
    const maskCtx = this.mask.getContext('2d');
    this.img.onload = () => {
      maskCtx.fillStyle = color || CAR_COLOR;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = 'destination-atop';
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    console.log(this);
  }

  createPolygon() {
    const points: Point[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.anchor.x - Math.sin(this.angle - alpha) * rad,
      y: this.anchor.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.anchor.x - Math.sin(this.angle + alpha) * rad,
      y: this.anchor.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.anchor.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.anchor.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.anchor.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.anchor.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  private move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.controls.break) {
      if (this.speed > 0) {
        this.speed -= CAR_BREAK_MULTIPLIER;
        if (this.speed < 0) {
          this.speed = 0
        }
      } else if (this.speed < 0) {
        this.speed += CAR_BREAK_MULTIPLIER;
        if (this.speed > 0) {
          this.speed = 0
        }
      }
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    } else if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.anchor.x -= Math.sin(this.angle) * this.speed;

    this.anchor.y -= Math.cos(this.angle) * this.speed;
  }

  update(roadBorders?: Border[], traffic?: any) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(
        s => s == null ? 0 : 1 - s.offset
      );

      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      if (this.useBrain) {
        this.controls.forward = outputs[0] === 1;
        this.controls.left = outputs[1] === 1;
        this.controls.right = outputs[2] === 1;
        this.controls.reverse = outputs[3] === 1;
        this.controls.break = outputs[4] === 1;
      }
    }
  }

  assessDamage(roadBorders: Border[], traffic: Car[]) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D, drawSensor: boolean = false): void {
    if (this.sensor && (this.drawSensor || drawSensor)) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.anchor.x, this.anchor.y);
    ctx.rotate(-this.angle);

    if (!this.damaged) {
      ctx.drawImage(this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = 'multiply';
    }
    ctx.drawImage(this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}


