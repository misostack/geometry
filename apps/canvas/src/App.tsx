import { useEffect, useRef, useState } from "react";
import "./App.css";
import BoardContext, { BoardContextType } from "./context/BoardContext";
import { Geometry, GeometryFactory } from "./domain/Geometry";
import { Color, GeometryType } from "./domain/contracts";
import Line from "./domain/Line";
import Marking from "./assets/marking.png";
import useWindowSize from "./hooks/useWindowSize";

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
  const board = useRef<HTMLCanvasElement>(null);
  const pitch = useRef(new Image());
  const [boardContext, setBoardContext] = useState<BoardContextType>(null);
  const size = useWindowSize();
  // const geometries: Geometry[] = [];
  // const line1: Line = GeometryFactory.create(GeometryType.Line, {
  //   startPoint: { x: 0, y: 0 },
  //   endPoint: { x: 320, y: 320 },
  //   color: Color.Yellow,
  // });
  // const circles = line1.findOsculatingCirclesAtMiddle(20);

  // geometries.push(line1, ...circles);

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
      // geometries.map((g) => {
      //   g.draw(boardContext);
      // });
      pitch.current.onload = () => {
        if (board.current) {
          const img = pitch.current;
          const canvas = board.current;
          // Get image and canvas dimensions
          const imgWidth = img.width;
          const imgHeight = img.height;

          // Set canvas dimensions to match screen width and height
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

          // Calculate the aspect ratios
          const imgAspectRatio = imgWidth / imgHeight;
          const canvasAspectRatio = canvasWidth / canvasHeight;

          let renderWidth, renderHeight;

          if (imgAspectRatio < canvasAspectRatio) {
            // Image is narrower in proportion to the canvas
            renderWidth = canvasWidth;
            renderHeight = imgHeight * (renderWidth / imgWidth);
          } else {
            // Image is wider in proportion to the canvas
            renderHeight = canvasHeight;
            renderWidth = imgWidth * (renderHeight / imgHeight);
          }

          // Calculate the position to center the image on the canvas
          const x = (canvasWidth - renderWidth) / 2;
          const y = (canvasHeight - renderHeight) / 2;

          boardContext.clearRect(0, 0, canvasWidth, canvasHeight);
          // Set the specific background color
          boardContext.fillStyle = "rgb(157, 201, 88)"; // Using the extracted color
          boardContext.fillRect(0, 0, canvas.width, canvas.height);
          // Clear the canvas and draw the image
          boardContext.drawImage(
            pitch.current,
            x,
            y,
            renderWidth,
            renderHeight
          );
        }
      };
      pitch.current.src = Marking;
    }
  }, [boardContext]);

  useEffect(() => {
    if (board.current) {
      board.current.style.width = `${size.width}px`;
      board.current.style.height = `${size.height}px`;
    }
  }, [size]);

  return (
    <>
      <BoardContext.Provider value={boardContext}>
        <canvas ref={board} id="mainCanvas"></canvas>
      </BoardContext.Provider>
    </>
  );
}

export default App;
