import { FunctionComponent } from "react";
import { WIN_LABEL, WRONG_GUESS_LABEL } from "../../../constants/Board";
import { Shell } from "../../../interfaces/Shell";
import './Board.scss';

interface BoardProps {
  children?: React.ReactNode;
  selectedShell: Shell;
  hasShellBeenSelected: boolean;
}

const Board: FunctionComponent<BoardProps> = ({ children, selectedShell, hasShellBeenSelected }) => {
  return (
    <div  className="shell-board">
      <div role="grid" className="shell-board__result">{selectedShell && hasShellBeenSelected && 
      (selectedShell.isBallAcquired ? WIN_LABEL : WRONG_GUESS_LABEL)}</div>
      {children}
    </div>
  );
};

export default Board;