import { Border } from "../../models/border";
import { Intersection } from "../../models/intersection";
import { Point } from "../../models/point";
import { getIntersection, lerp } from "../../utils/utils";
import { Car } from "./car";

export interface ISensor {
  car: Car;
  rayCount?: number;
  reyLength?: number;
  raySpread?: number;
  rays?: [Point, Point][];
  readings?: Intersection[]
}

export class Sensor implements ISensor {
  car: Car;
  rayCount: number;
  reyLength: number;
  raySpread: number;
  rays: [Point, Point][];
  readings?: Intersection[]

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 5;
    this.reyLength = 200;
    this.raySpread = Math.PI / 2;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Border[], traffic: Car[]) {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(
        this.getReading(
          this.rays[i],
          roadBorders,
          traffic
        ));
    }
  }

  getReading(ray: Border, roadBorders: Border[], traffic: Car[]) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length],
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map(e => e.offset);
      const minOffset = Math.min(...offsets);

      return touches.find(e => e.offset == minOffset);
    }
  }

  private castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
      ) + this.car.angle;

      const start = { x: this.car.anchor.x, y: this.car.anchor.y };

      const end = {
        x: this.car.anchor.x - Math.sin(rayAngle) * this.reyLength,
        y: this.car.anchor.y - Math.cos(rayAngle) * this.reyLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rays.length; i++) {

      let end = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i].anchor;
      }

      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y);
      ctx.lineTo(
        end.x,
        end.y
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.moveTo(
        this.rays[i][1].x,
        this.rays[i][1].y);
      ctx.lineTo(
        end.x,
        end.y
      );
      ctx.stroke();
    }
  }
}