import { Point } from '../../models/point';
import { Drawable, IDrawable } from './../../models/drawable';
import { GraphPoint, IGraphPoint } from './graph-point';
import { GraphSegment, IGraphSegment } from './graph-segment';


export interface IGraph extends IDrawable {
  points?: IGraphPoint[],
  segments?: IGraphSegment[]
}

export class Graph extends Drawable implements IGraph {


  constructor(
    public points: GraphPoint[] = [],
    public segments: GraphSegment[] = [],
    data: Partial<IDrawable> = {}
  ) {
    super(data)

    this.segments = segments;
    this.points = points;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    console.log('Graph -> Drawing...🐲');

    for (const seg of this.segments) {
      seg.draw(ctx);
    }

    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}
