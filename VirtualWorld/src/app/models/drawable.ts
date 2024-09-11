import { ORIGIN, Point } from "./point";

export interface IDrawable {
  anchor?: Point;
  width?: number;
  height?: number;
  angle?: number;
  draw(ctx: CanvasRenderingContext2D): void ;
}

export const getEmptyDrawable = (): IDrawable => {
  return {
    anchor: ORIGIN,
    width: 0,
    height: 0,
    angle: 0,
    draw(ctx: CanvasRenderingContext2D): void {}
  }
}

/** Representa um componente desenhavel em um Canvas  */
export class Drawable implements IDrawable {
  anchor: Point;
  width: number;
  height: number;
  angle: number;

  constructor(data?: Partial<IDrawable>) {
    const { anchor, width, height, angle } = data || getEmptyDrawable();

    this.anchor = anchor || ORIGIN;
    this.width = width || 0;
    this.height = height || 0;
    this.angle = angle || 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }

}
