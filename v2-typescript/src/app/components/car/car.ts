import { CAR_ACCELERATION, CAR_COLOR, CAR_FRICTION, CAR_IMAGE_SRC, CAR_MAX_SPEED } from '../../config/car.config';
import { CarControlType } from '../../enums/car-control-type.enum';
import { Drawable, IDrawable } from '../../models/drawable';
import { Point } from '../../models/point';
import { CarControls } from './controls';

export interface ICar extends IDrawable {
  speed?: number;
  acceleration?: number;
  maxSpeed?: number;
  friction?: number;
  useBrain?: boolean;
  controlType?: CarControlType;
  controls?: CarControls;
  damaged?: boolean;
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

  mask?: HTMLCanvasElement;
  img?: HTMLImageElement;

  constructor(data?: ICar) {
    super(data);

    const { speed, acceleration, maxSpeed, friction, controlType, damaged, width, height } = data;
    this.speed = speed || 0;
    this.acceleration = acceleration || CAR_ACCELERATION;
    this.maxSpeed = maxSpeed || CAR_MAX_SPEED;
    this.friction = friction || CAR_FRICTION;
    this.controlType = controlType || CarControlType.DUMMY;

    this.controls = new CarControls(controlType);
    this.damaged = damaged || false;

    // todo separar contexto
    this.img = new Image();
    this.img.src = CAR_IMAGE_SRC;
    this.mask = document.createElement('canvas');
    this.mask.width = width;
    this.mask.height = height;
    const maskCtx = this.mask.getContext('2d');
    this.img.onload = () => {
      maskCtx.fillStyle = CAR_COLOR;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = 'destination-atop';
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    console.log(this);
  }

  private move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
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

  update(roadBorders?: [Point, Point][], traffic?: any) {
    this.move();
    // if (!this.damaged) {
    //   this.#move();
    //   this.polygon = this.#createPolygon();
    //   this.damaged = this.#assessDamage(roadBorders, traffic);
    // }
    // if (this.sensor) {
    //   this.sensor.update(roadBorders, traffic);
    //   const offsets = this.sensor.readings.map(
    //     s => s == null ? 0 : 1 - s.offset
    //   );
    //   const outputs = NeuralNetwork.feedForward(offsets, this.brain);


    //   if (this.useBrain) {
    //     this.controls.forward = outputs[0];
    //     this.controls.left = outputs[1];
    //     this.controls.right = outputs[2];
    //     this.controls.reverse = outputs[3];
    //   }

    // }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // if (this.sensor && drawSensor) {
    //   this.sensor.draw(ctx);
    // }

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


