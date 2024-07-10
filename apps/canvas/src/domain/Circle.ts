import { BoardContextType } from "../context/BoardContext";
import { Color, Point } from "./contracts";
import { Geometry } from "./Geometry";

export default class Circle implements Geometry {
  constructor(
    private center: Point,
    private radius: number,
    private color: Color
  ) {}
  draw(ctx: BoardContextType): void {
    if (ctx) {
      ctx.beginPath();
      // clockwise
      ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}
