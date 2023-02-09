import { ROAD_BOTTOM_LIMIT, ROAD_LANE_COUNT, ROAD_TOP_LIMIT } from "../../config/road.config";
import { Drawable, IDrawable } from "../../models/drawable";
import { Point } from "../../models/point";
import { lerp } from "../../utils/utils";

export interface IRoad extends IDrawable {
  laneCount?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  borders?: [Point, Point][];
}

export class Road extends Drawable implements IRoad {

  /*PROPERTIES */
  laneCount?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  borders?: [Point, Point][];
  /*PROPERTIES */

  constructor(data: IRoad) {
    super(data);
    console.log('Road');
    this.getRoadLimits(data);
  }

  getRoadLimits(data: IRoad): void {

    const { anchor, width, laneCount, top, bottom } = data;

    this.laneCount = laneCount || ROAD_LANE_COUNT;

    this.left = anchor.x - width / 2;
    this.right = anchor.x + width / 2;

    this.top = top || ROAD_TOP_LIMIT;
    this.bottom = bottom || ROAD_BOTTOM_LIMIT;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex: number) {
    const laneWidht = this.width / this.laneCount;
    return this.left + laneWidht / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidht;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';

    for (let i = 1; i <= this.laneCount; i++) {
      const x = lerp(
        this.left,
        this.right,
        i / this.laneCount
      );

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach(border => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}