import { Drawable, IDrawable } from "../../models/drawable";
import { Point } from "../../models/point";

export interface IGraphSegment {
  point1: Point;
  point2: Point;
  color: string;
  width: number;
}

export class GraphSegment extends Drawable implements IGraphSegment {
  point1: Point;
  point2: Point;
  color: string;
  width: number;

  constructor(
    data: IGraphSegment
  ) {
    super(data);
    const { point1, point2, color, width } = data;

    this.point1 = point1;
    this.point2 = point2;
    this.color = color || 'black';
    this.width = width || 2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.point1.x, this.point1.y);
    ctx.lineTo(this.point2.x, this.point2.y);
    ctx.stroke();
  }
}
