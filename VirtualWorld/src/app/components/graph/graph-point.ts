import { Drawable, IDrawable } from "../../models/drawable";
import { Point } from "../../models/point";



export class GraphPoint implements Point {

  constructor(public x: number = 0, public y: number = 0) {
    //
  }

  draw(ctx: CanvasRenderingContext2D, size = 18, color = 'black'): void {
    const rad = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
}
