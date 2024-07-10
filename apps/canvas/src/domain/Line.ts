import { BoardContextType } from "../context/BoardContext";
import Circle from "./Circle";
import { Color, Point } from "./contracts";
import { Geometry } from "./Geometry";

export default class Line implements Geometry {
  p1!: Point;
  p2!: Point;
  color: Color;

  constructor(p1: Point, p2: Point, color: Color) {
    this.p1 = p1;
    this.p2 = p2;
    this.color = color;
  }

  draw(ctx: BoardContextType): void {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(this.p1.x, this.p1.y);
      ctx.lineTo(this.p2.x, this.p2.y);
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }

  /* đường tròn mật tiếp */
  findOsculatingCirclesAtMiddle(radius: number): Circle[] {
    // Calculate the midpoint of the line segment
    const midX = (this.p2.x - this.p1.x) / 2;
    const midY = (this.p2.y - this.p1.y) / 2;

    // Calculate the slope of the line segment
    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;

    // Calculate the direction of the perpendicular line
    // Normalize the direction vector for the perpendicular
    const length = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / length;
    const perpY = dx / length;

    // Calculate the centers of the circle tangent to the line segment at the midpoint
    const centerX1 = midX + perpX * radius;
    const centerY1 = midY + perpY * radius;
    const centerX2 = midX - perpX * radius;
    const centerY2 = midY - perpY * radius;

    // { x: centerX1, y: centerY1 }, // Center on one side of the line
    // { x: centerX2, y: centerY2 }  // Center on the opposite side

    return [
      new Circle({ x: centerX1, y: centerY1 }, radius, this.color),
      new Circle({ x: centerX2, y: centerY2 }, radius, this.color),
    ];
  }
}
