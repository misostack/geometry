import { createContext } from "react";
export type BoardContextType = CanvasRenderingContext2D | null;
const BoardContext = createContext<BoardContextType>(null);

export default BoardContext;
