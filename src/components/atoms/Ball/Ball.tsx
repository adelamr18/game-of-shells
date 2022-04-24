import { FunctionComponent } from "react";
import './Ball.scss'

interface BallProps {
  getBallClasses: () => string;
  randomlyShuffleCells: () => void;
}
const Ball: FunctionComponent<BallProps> = ({ getBallClasses, randomlyShuffleCells }) => {
  return <div onAnimationEnd={randomlyShuffleCells} className={getBallClasses()}></div>;
};

export default Ball;
