import { FunctionComponent } from "react";
import './FormOptions.scss'

interface FormOptionsProps {
handleLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
maxMovesLimit: number;
maxMoves: number;
hasGameStarted: () => boolean;
didGameEnd: () => boolean;
level: string;
}

const FormOptions: FunctionComponent<FormOptionsProps> = ({ handleLevelChange, maxMovesLimit, maxMoves, hasGameStarted, didGameEnd, level }) => {
  return (
    <div className="form__level-options">
      <label className="form__input-label">
        <input
          type="radio"
          name="difficulty"
          role="radio"
          value={maxMoves}
          onChange={handleLevelChange}
          checked={maxMovesLimit === maxMoves}
          disabled={hasGameStarted() && !didGameEnd()}
        />
        {level}
      </label>
    </div>
  );
};

export default FormOptions;
