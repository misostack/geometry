import { useEffect, useRef, useState } from "react";
import "./App.css";
import BoardContext, { BoardContextType } from "./context/BoardContext";

/*
Head: 1 unit diameter circle.
Torso: 2.5 units long.
Arms: 3 units long (1.5 units per segment).
Legs: 8 units long (4 units per segment).
*/

type Point = {
  x: number;
  y: number;
};

enum Color {
  Red = "#FF0000",
  Yellow = "#e9d700",
  Blue = "#0000FF",
}

interface Line {
  type: "line";
  p1: Point;
  p2: Point;
  color: Color;
}

interface Circle {
  type: "circle";
  p: Point;
  radius: number;
  color: Color;
}

interface FrameConfig {
  handDeltaX: number;
  handDeltaY: number;
  footDeltaX: number;
  footDeltaY: number;
}

function generateWalkingAnimationFrames(
  startPoint: Point,
  width: number,
  height: number,
  color: Color,
  frameConfigs: FrameConfig[],
  steps: number, // Number of pixels to move horizontally each frame
  totalFrames: number // Total number of frames in the animation
): Array<Array<Geometry>> {
  const frames: Array<Array<Geometry>> = [];

  for (let i = 0; i < totalFrames; i++) {
    const frameIndex = i % frameConfigs.length; // Loop through frame configurations
    const config = frameConfigs[frameIndex];
    const frame = createStickyMan(
      { x: startPoint.x + steps * i, y: startPoint.y }, // Update x coordinate
      width,
      height,
      color,
      config.handDeltaX,
      config.handDeltaY,
      config.footDeltaX,
      config.footDeltaY
    );
    frames.push(frame);
  }

  return frames;
}

type Geometry = Line | Circle;

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

const drawCircle = (ctx: BoardContextType, circle: Circle) => {
  if (ctx) {
    ctx.beginPath();
    ctx.moveTo(circle.p.x, circle.p.y);
    ctx.arc(circle.p.x, circle.p.y, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();
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

const createStickyMan = (
  startPoint: Point,
  width: number,
  height: number,
  color: Color,
  handDeltaX: number = 0,
  handDeltaY: number = 0,
  footDeltaX: number = 0,
  footDeltaY: number = 0
): Array<Geometry> => {
  const geometries: Array<Geometry> = [];
  //
  // startPoint is the top left point
  // head(1), torso(2.5), left hand(1.5), right hand(1.5), left foot(4), right foot(4)
  // totalHeight = head + torso + foot = 1 + 2.5 + 4 = 7.5
  const middlePointX = startPoint.x + width / 2;
  startPoint.y = startPoint.y - height / 2;
  const unit = height / 7.5;
  const headRadius = unit;
  const footHeight = 3 * unit;
  const head: Circle = {
    p: {
      x: middlePointX,
      y: startPoint.y,
    },
    radius: headRadius,
    color,
    type: "circle",
  };
  geometries.push(head);
  const startPointTorso: Point = {
    x: middlePointX,
    y: startPoint.y + headRadius,
  };
  const body: Line = {
    p1: { x: middlePointX, y: startPoint.y },
    p2: { x: middlePointX, y: startPoint.y + height - footHeight },
    color,
    type: "line",
  };
  geometries.push(body);
  const leftHand: Line = {
    color,
    p1: { x: startPointTorso.x, y: startPointTorso.y },
    p2: {
      x: startPointTorso.x + width / 2 + handDeltaX,
      y: startPointTorso.y + headRadius + handDeltaY,
    },
    type: "line",
  };
  geometries.push(leftHand);
  const rightHand: Line = {
    color,
    p1: { x: startPointTorso.x, y: startPointTorso.y },
    p2: {
      x: startPointTorso.x - width / 2 + handDeltaX,
      y: startPointTorso.y + headRadius + handDeltaY,
    },
    type: "line",
  };
  geometries.push(rightHand);
  const leftFoot: Line = {
    color,
    p1: { x: middlePointX, y: body.p2.y },
    p2: {
      x: middlePointX + width / 2 + footDeltaX,
      y: body.p2.y + footHeight + footDeltaY,
    },
    type: "line",
  };
  const rightFoot: Line = {
    color,
    p1: { x: middlePointX, y: body.p2.y },
    p2: {
      x: middlePointX - width / 2 + footDeltaX,
      y: body.p2.y + footHeight + footDeltaY,
    },
    type: "line",
  };
  geometries.push(leftFoot);
  geometries.push(rightFoot);

  return geometries;
};

const drawStickyMan = (
  boardContext: BoardContextType,
  geometries: Array<Geometry>
) => {
  geometries.map((geo) => {
    switch (geo.type) {
      case "line":
        drawLine(boardContext, geo);
        break;
      case "circle":
        drawCircle(boardContext, geo);
        break;
    }
  });
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
    type: "line",
  });
  const startPoint = { x: 0, y: screen.availHeight / 2 };
  // const geometries = createStickyMan(startPoint, 100, 200, Color.Yellow);
  const width = 50;
  const height = 150;

  // Generate the frames for the animation
  const frameConfigs: FrameConfig[] = [
    { handDeltaX: 5, handDeltaY: 0, footDeltaX: 5, footDeltaY: 0 }, // Right leg and arm forward
    { handDeltaX: -5, handDeltaY: 0, footDeltaX: -5, footDeltaY: 0 }, // Left leg and arm forward
  ];

  // Generate the frames for the animation
  const steps = 50; // Number of pixels to move right each frame
  const totalFrames = screen.availWidth / width; // Number of frames in the animation

  const frameRate = 10;

  const walkingFrames = generateWalkingAnimationFrames(
    startPoint,
    width,
    height,
    Color.Yellow,
    frameConfigs,
    steps,
    totalFrames
  );
  let currentFrame = 0;

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
      // let's draw sticky man
      // let's draw frame
      let animationFrameId: number;
      let timeoutId: number;

      // Function to draw each frame
      const drawFrame = () => {
        if (board.current) {
          const ctx = boardContext;
          const canvas = board.current as HTMLCanvasElement;
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

          const frame = walkingFrames[currentFrame];
          drawStickyMan(boardContext, frame);

          currentFrame = (currentFrame + 1) % walkingFrames.length;
          timeoutId = setTimeout(() => {
            animationFrameId = requestAnimationFrame(drawFrame);
          }, 1000 / frameRate); // delay in milliseconds
        }
      };
      // Start the animation
      drawFrame();

      // Clean up function
      return () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);
      };
    }
  }, [boardContext, walkingFrames, frameRate]);

  return (
    <>
      <BoardContext.Provider value={boardContext}>
        <canvas ref={board} id="mainCanvas"></canvas>
      </BoardContext.Provider>
    </>
  );
}

export default App;
