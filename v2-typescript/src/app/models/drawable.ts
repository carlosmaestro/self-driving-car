

export interface IDrawable {
  x?: number; 
  y?: number; 
  width?: number; 
  height?: number;
  angle?: number;
}

/** Representa um componente desenhavel em um Canvas  */
export class Drawable implements IDrawable {
  x: number;
  y: number;
  width?: number; 
  height?: number;
  angle?: number;

  constructor(data?: IDrawable) {
    const { x, y, width, height } = data;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }

}