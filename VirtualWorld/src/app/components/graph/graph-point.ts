import { Drawable, IDrawable } from "../../models/drawable";

export interface IGraphPoint extends IDrawable{
  
}

export class GraphPoint extends Drawable {

  constructor(data: IGraphPoint) {
    super(data)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    console.log('IGraphPoint -> Drawing...🐲');
  }
}
