import { PropsWithChildren, useEffect, useRef } from "react";
import { BoardContextType } from "../context/BoardContext";
import Marking from "../assets/marking.png";

const Soccer = (props: PropsWithChildren<{ ctx: BoardContextType }>) => {
  const ctx = props.ctx;
  const img = useRef(new Image());

  useEffect(() => {
    if (ctx) {
      img.current.src = Marking;
      img.current.onload = () => {
        ctx.drawImage(img.current, 0, 0, screen.availWidth, screen.availHeight);
      };
    }
  }, []);
  return <></>;
};

export default Soccer;
