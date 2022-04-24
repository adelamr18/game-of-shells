import { FunctionComponent, useState } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT, SELECT_LEVEL } from "../../constants/Board";
import { BUTTON_TEXT } from "../../constants/Button";
import { FORM_OPTIONS_CONFIG } from "../../constants/FormOptions";
import {
  INITIAL_FIRST_X_COORDINATE,
  INITIAL_Y_COORDINATE,
  INITIAL_SECOND_X_COORDINATE,
  INITAL_THIRD_X_COORDINATE,
  SHELL_SIZE,
  DEFAULT_SHELL,
} from "../../constants/Shell";
import { FormOption } from "../../interfaces/FormOptions";
import { Position } from "../../interfaces/Position";
import { Shell } from "../../interfaces/Shell";
import Ball from "../atoms/Ball/Ball";
import Button from "../atoms/Button/Button";
import Board from "../molecules/Board/Board";
import "./Dashboard.scss";
import FormOptions from "../molecules/FormOptions/FormOptions";
import { BEGIN_BALL_TRANSITION_CLASS, DEFAULT_BALL_CLASS, SUCCESSFUL_BALL_GUESS_CLASS } from "../../constants/Ball";

const Dashboard: FunctionComponent = () => {
  const [selectedShell, setSelectedShell] = useState<Shell>(DEFAULT_SHELL);
  const [hasShellBeenSelected, setShellSelection] = useState<boolean>(false);
  const [lockedNumMovesLimit, setLockedNumMovesLimit] = useState(3);
  const [maxMovesLimit, setMaxMovesLimit] = useState(3);
  const [shellState, setSelectedShellState] = useState([
    [
      { x: INITIAL_FIRST_X_COORDINATE, y: INITIAL_Y_COORDINATE, isBallAcquired: false },
      { x: INITIAL_SECOND_X_COORDINATE, y: INITIAL_Y_COORDINATE, isBallAcquired: false },
      { x: INITAL_THIRD_X_COORDINATE, y: INITIAL_Y_COORDINATE, isBallAcquired: false },
    ],
  ]);
  let shellTransitions = 0;

  const hasGameStarted = (): boolean => {
    return shellState[0].some((shell) => shell.isBallAcquired);
  };

  const finalShellShuffle = (shells: Shell[]): Shell[] => {
    const availableShellPositions = shells.map(({ x }) => x);

    const shuffledShells = shells.map((shell: Shell) => {
      const randomShellIndex = Math.floor(Math.random() * availableShellPositions.length);

      shell.x = availableShellPositions[randomShellIndex];
      availableShellPositions.splice(randomShellIndex, 1);

      return shell;
    });

    return shuffledShells;
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShellSelection(false);
    setMaxMovesLimit(Number(e.target.value));
  };

  const numCompletedMoves = (): number => {
    return shellState.length - 1;
  };

  const isBallPresent = (): boolean => {
    return shellState.length === 1 && hasGameStarted();
  };

  const randomlyShuffleCells = (): void => {
    const isFinalShellMove = numCompletedMoves() === lockedNumMovesLimit - 1;
    const newShellPositions = isFinalShellMove ? finalShellShuffle(shellState[0]) : createNewShellPositions();

    if (didGameEnd()) {
      return;
    }
    setSelectedShellState(shellState.concat([newShellPositions]));
  };

  const didGameEnd = (): boolean => {
    return numCompletedMoves() === lockedNumMovesLimit;
  };

  const createNewShellPositions = (): Shell[] => {
    const shellSize = SHELL_SIZE;

    const generateNewPosition = (shell: Shell): Shell => {
      shell.x = Math.floor(Math.random() * (BOARD_WIDTH - shellSize));
      shell.y = Math.floor(Math.random() * (BOARD_HEIGHT - shellSize));
      shell.isBallAcquired = false;

      return shell;
    };

    const hasShellOverlapped = (positions: Position[], newShellPosition: Position) => {
      return positions.some(({ x, y }) => {
        const xOverlap = newShellPosition.x >= x - shellSize && newShellPosition.x <= x + shellSize;
        const yOverlap = newShellPosition.y >= y - shellSize && newShellPosition.y <= y + shellSize;

        return xOverlap && yOverlap;
      });
    };

    const newPositions = currentShells().reduce((shells: Shell[], curruentShell: Shell) => {
      const newShell = Object.assign({}, curruentShell);
      let newShellPosition = generateNewPosition(newShell);

      while (hasShellOverlapped(shells, newShellPosition)) {
        newShellPosition = generateNewPosition(newShell);
      }

      shells.push(newShellPosition);
      return shells;
    }, []);

    return newPositions;
  };

  const handleGameCommencement = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    shellTransitions = 0;
    const winningIndex = Math.floor(Math.random() * currentShells.length);
    const newlyCreatedShells = currentShells().map((shell: Shell, shellIndex: number) => {
      const newlyCreatedShell = Object.assign({}, shell);

      newlyCreatedShell.isBallAcquired = shellIndex === winningIndex;
      return newlyCreatedShell;
    });

    setLockedNumMovesLimit(maxMovesLimit);
    setSelectedShell(DEFAULT_SHELL);
    setSelectedShellState([newlyCreatedShells]);
  };

  const currentShells = (): Shell[] => {
    return shellState[shellState.length - 1];
  };

  const handleShellTransitionEnd = (): void => {
    shellTransitions++;
    if (shellTransitions % 3 === 0) {
      randomlyShuffleCells();
    }
  };

  const isButtonDisabled = (): boolean => {
    return hasGameStarted() && numCompletedMoves() < lockedNumMovesLimit ? true : false;
  };

  const chooseShell = (shell: Shell) => {
    setShellSelection(true);
    setSelectedShell(shell);
  };

  const getShellCoordinates = (x: number, y: number): string => {
    return `translate(${x}px, ${y}px)`;
  };

  const getBallClasses = (): string => {
    const ballClasses = [DEFAULT_BALL_CLASS];

    if (selectedShell && selectedShell.isBallAcquired) {
      ballClasses.push(SUCCESSFUL_BALL_GUESS_CLASS);
    }

    if (isBallPresent()) {
      ballClasses.push(BEGIN_BALL_TRANSITION_CLASS);
    }

    return ballClasses.join(" ");
  };

  const shellDomElements = currentShells().map((shell: Shell, index: number) => (
    <div
      key={index}
      role="cell"
      className="shell-element"
      onClick={() => chooseShell(shell)}
      onTransitionEnd={handleShellTransitionEnd}
      style={{ transform: getShellCoordinates(shell.x, shell.y) }}
    >
      {shell.isBallAcquired && <Ball randomlyShuffleCells={randomlyShuffleCells} getBallClasses={getBallClasses} />}
    </div>
  ));

  return (
    <div className="form-container">
      <form role="form" className="form" onSubmit={handleGameCommencement}>
        <div className="form__submit-container">
          <Button isButtonDisabled={isButtonDisabled()} buttonText={BUTTON_TEXT}></Button>
        </div>

        <div className="form__level-options">
          <h3>{SELECT_LEVEL}</h3>
          {FORM_OPTIONS_CONFIG.map((formOption: FormOption, index: number) => {
            return (
              <FormOptions
                key={index}
                handleLevelChange={handleLevelChange}
                maxMoves={formOption.maxMoves}
                maxMovesLimit={maxMovesLimit}
                level={formOption.level}
                hasGameStarted={hasGameStarted}
                didGameEnd={didGameEnd}
              ></FormOptions>
            );
          })}
        </div>
      </form>
      <Board hasShellBeenSelected={hasShellBeenSelected} selectedShell={selectedShell}>
        {shellDomElements}
      </Board>
    </div>
  );
};
export default Dashboard;
