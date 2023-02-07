import { CAR_ACCELERATION, CAR_MAX_SPEED } from "../../config/car.config";
import { Drawable, IDrawable } from "../../models/drawable";

export enum CarControlType{
  KEYS,
  DUMMY,
  AI,
}

export interface ICar extends IDrawable {
  speed?: number;
  acceleration?: number;
  maxSpeed?: number;
  friction?: number;
  useBrain?: boolean;
  controlType?: CarControlType;
}

export class Car extends Drawable implements ICar {
  speed?: number;
  acceleration?: number;
  maxSpeed?: number;
  friction?: number;
  useBrain?: boolean;
  controlType: CarControlType;

  constructor(data?: ICar) {
    super(data);

    const { speed, acceleration, maxSpeed, friction, controlType } = data;
    this.speed = speed || 0;
    this.acceleration = acceleration || CAR_ACCELERATION;
    this.maxSpeed = maxSpeed || CAR_MAX_SPEED;
    this.friction = friction || CAR_MAX_SPEED;
    this.controlType = controlType || CarControlType.DUMMY;
    
    console.log(this);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}


