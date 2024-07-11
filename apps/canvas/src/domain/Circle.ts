import { BoardContextType } from "../context/BoardContext";
import { Color, Point } from "./contracts";
import { Geometry } from "./Geometry";
import Triangle from "./Triangle";

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
      ctx.stroke();
    }
  }

  //   findInscribedTriangle(): Triangle[]{
  //     // Convert angle to radians
  //     theta = theta * Math.PI / 180;

  //     // Point of tangency T
  //     const Tx = centerX + radius * Math.cos(theta);
  //     const Ty = centerY + radius * Math.sin(theta);

  //     // Calculate the slope of the line perpendicular to OT
  //     const slopePerp = -1 / Math.tan(theta);

  //     // Now calculate points A and B on the circle
  //     const angleA = theta + Math.PI / 3;  // 60 degrees away from T
  //     const angleB = theta - Math.PI / 3;  // 60 degrees away from T

  //     const Ax = centerX + radius * Math.cos(angleA);
  //     const Ay = centerY + radius * Math.sin(angleA);

  //     const Bx = centerX + radius * Math.cos(angleB);
  //     const By = centerY + radius * Math.sin(angleB);

  //   }
}
