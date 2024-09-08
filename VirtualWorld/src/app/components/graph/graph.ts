import { Point } from '../../models/point';
import { Drawable, IDrawable } from './../../models/drawable';
import { IGraphPoint } from './graph-point';
import { IGraphSegment } from './graph-segment';


export interface IGraph extends IDrawable {
  points: IGraphPoint[],
  segments: IGraphSegment[]
}

export class Graph extends Drawable {

  constructor(data: IGraph = { points: [], segments: [] }) {
    super(data)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    console.log('Graph -> Drawing...🐲');
  }
}
