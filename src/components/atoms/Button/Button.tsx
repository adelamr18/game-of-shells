import { FunctionComponent } from "react";
import "./Button.scss";

interface ButtonProps {
  buttonText: string;
  isButtonDisabled: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({buttonText, isButtonDisabled}) => {
  return (
    <div className="form__submit-container">
      <button role="button" disabled={isButtonDisabled} type="submit" id="submit-button" className="form__submit-button">
        {buttonText}
      </button>
    </div>
  );
};

export default Button;
