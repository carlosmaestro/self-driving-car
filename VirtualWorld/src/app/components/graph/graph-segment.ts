import { Drawable, IDrawable } from "../../models/drawable";

export interface IGraphSegment extends IDrawable{

}

export class GraphSegment extends Drawable {

  constructor(data: IGraphSegment = {}) {
    super(data)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    console.log('GraphSegment -> Drawing...🐲');
  }
}
