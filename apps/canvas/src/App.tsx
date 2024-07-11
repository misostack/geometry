import { useEffect, useRef, useState } from "react";
import "./App.css";
import BoardContext, { BoardContextType } from "./context/BoardContext";
import { Geometry, GeometryFactory } from "./domain/Geometry";
import { Color, GeometryType } from "./domain/contracts";
import Line from "./domain/Line";

// const drawLine = (ctx: BoardContextType, line: Line) => {
//   if (ctx) {
//     const x1 = line.p1.x;
//     const y1 = line.p1.y;
//     ctx.beginPath();
//     ctx.moveTo(x1, y1);
//     const x2 = line.p2.x;
//     const y2 = line.p2.y;
//     ctx.lineTo(x2, y2);
//     ctx.strokeStyle = line.color;
//     ctx.stroke();
//   }
// };

// const drawPoint = (ctx: BoardContextType, point: Point, color: Color) => {
//   if (ctx) {
//     ctx.beginPath();
//     ctx.moveTo(point.x, point.y);
//     ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
//     ctx.fillStyle = color;
//     ctx.fill();
//     // ctx.strokeStyle = color;
//     // ctx.stroke();
//   }
// };

// const drawCircle = (ctx: BoardContextType, circle: Circle) => {
//   if (ctx) {
//     ctx.beginPath();
//     ctx.moveTo(circle.p.x, circle.p.y);
//     ctx.arc(circle.p.x, circle.p.y, circle.radius, 0, 2 * Math.PI);
//     ctx.fillStyle = circle.color;
//     ctx.fill();
//   }
// };

function App() {
  const board = useRef(null);
  const [boardContext, setBoardContext] = useState<BoardContextType>(null);
  const geometries: Geometry[] = [];
  const line1: Line = GeometryFactory.create(GeometryType.Line, {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 320, y: 320 },
    color: Color.Yellow,
  });
  const circles = line1.findOsculatingCirclesAtMiddle(20);

  geometries.push(line1, ...circles);

  useEffect(() => {
    if (board.current) {
      const canvas = board.current as HTMLCanvasElement;
      const scale = window.devicePixelRatio; // Get the device's pixel ratio
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.style.background = "#FFF";

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale); // Normalize the coordinate system
        setBoardContext(ctx);
      }
    }
  }, [board]);

  useEffect(() => {
    if (boardContext) {
      geometries.map((g) => {
        g.draw(boardContext);
      });
    }
  }, [boardContext]);

  return (
    <>
      <BoardContext.Provider value={boardContext}>
        <canvas ref={board} id="mainCanvas"></canvas>
      </BoardContext.Provider>
    </>
  );
}

export default App;
