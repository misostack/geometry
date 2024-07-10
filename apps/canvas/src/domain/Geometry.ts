import { BoardContextType } from "../context/BoardContext";
import Circle from "./Circle";
import { Color, GeometryType, Point } from "./contracts";
import Line from "./Line";

export interface Geometry {
  draw(ctx: BoardContextType): void;
}

export interface LinePayload {
  startPoint: Point;
  endPoint: Point;
  color: Color;
}

// Interface for the payload to create a Circle
export interface CirclePayload {
  center: Point;
  radius: number;
  color: Color;
}

export class GeometryFactory {
  static create(type: GeometryType.Circle, payload: CirclePayload): Circle;
  static create(type: GeometryType.Line, payload: LinePayload): Line;
  static create(type: GeometryType, payload: any): Geometry | null {
    switch (type) {
      case GeometryType.Line:
        return new Line(payload.startPoint, payload.endPoint, payload.color);
      case GeometryType.Circle:
        return new Circle(payload.center, payload.radius, payload.color);
    }
    return null;
  }
}
