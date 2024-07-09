import { useEffect, useRef, useState } from "react";
import "./App.css";
import BoardContext, { BoardContextType } from "./context/BoardContext";

type Point = {
  x: number;
  y: number;
};

enum Color {
  Red = "#FF0000",
  Yellow = "FFFF00",
  Blue = "#0000FF",
}

type Line = {
  p1: Point;
  p2: Point;
  color: Color;
};

const drawLine = (ctx: BoardContextType, line: Line) => {
  if (ctx) {
    const x1 = line.p1.x;
    const y1 = line.p1.y;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const x2 = line.p2.x;
    const y2 = line.p2.y;
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = line.color;
    ctx.stroke();
  }
};

const drawPoint = (ctx: BoardContextType, point: Point, color: Color) => {
  console.log(point.x, point.y);
  if (ctx) {
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // ctx.strokeStyle = color;
    // ctx.stroke();
  }
};

const findSomePointsBelongToALine = (
  line: Line,
  numPoints: number = 5
): Array<Point> => {
  const points: Array<Point> = [];
  const deltaX = line.p2.x - line.p1.x;
  const deltaY = line.p2.y - line.p1.y;
  // deltax = x2 - x1
  // deltay = y2 - y1
  // Assuming you want 𝑁 N points between 𝑃 1 P 1 ​ and 𝑃 2 P 2 ​
  // (including these points themselves), you can divide the line segment
  // into 𝑁 − 1 N−1 equal parts. The increment for each step, therefore, is given by:
  const incDeltaX = deltaX / (numPoints - 1);
  const incDeltaY = deltaY / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    if (i != 0 && i != numPoints - 1) {
      const x = line.p1.x + incDeltaX * i;
      const y = line.p1.y + incDeltaY * i;
      points.push({ x: x, y: y });
    }
  }

  return points;
};

function App() {
  const board = useRef(null);
  const [boardContext, setBoardContext] = useState<BoardContextType>(null);
  // init
  const lines: Array<Line> = [];
  lines.push({
    p1: { x: 0, y: 0 },
    p2: { x: screen.availWidth, y: screen.availHeight },
    color: Color.Blue,
  });

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
      // let's draw something
      lines.map((line) => {
        const points = findSomePointsBelongToALine(line, 5);
        drawLine(boardContext, line);
        if (points.length > 0) {
          points.map((point) => drawPoint(boardContext, point, line.color));
        }
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
