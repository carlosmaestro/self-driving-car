import { Point } from "./point";


export interface IDrawable {
  anchor?: Point;
  width?: number; 
  height?: number;
  angle?: number;
}

/** Representa um componente desenhavel em um Canvas  */
export class Drawable implements IDrawable {
  anchor?: Point;
  width?: number; 
  height?: number;
  angle?: number;

  constructor(data?: IDrawable) {
    const { anchor, width, height, angle } = data;

    this.anchor = anchor;
    this.width = width;
    this.height = height;
    this.angle = angle || 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }

}