import { BoardContextType } from "../context/BoardContext";
import { Color, Point } from "./contracts";
import { Geometry } from "./Geometry";

export default class Triangle implements Geometry {
  constructor(
    private pointA: Point,
    private pointB: Point,
    private pointC: Point,
    private color: Color
  ) {}
  draw(ctx: BoardContextType): void {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(this.pointB.x, this.pointB.y);
      ctx.lineTo(this.pointC.x, this.pointC.y);
      ctx.closePath();
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }
}
