import { ShallowWrapper, shallow } from "enzyme";
import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { BUTTON_TEXT } from "../../constants/Button";
import Button from "../atoms/Button/Button";
import { Shell } from "../../interfaces/Shell";
import Ball from "../atoms/Ball/Ball";
import { DEFAULT_SHELL, SHELLS_DATA } from "../../constants/Shell";
import Board from "../molecules/Board/Board";

describe("<Dashboard> component", () => {
  let component: ShallowWrapper;
  const isButtonDisabled = jest.fn();
  const chooseShell = jest.fn();
  const getShellCoordinates = jest.fn();
  const randomlyShuffleCells = jest.fn();
  const getBallClasses = jest.fn();
  const handleShellTransitionEnd = jest.fn();

  beforeEach(() => {
    component = shallow(<Dashboard />);
  });

  describe("Rendering Dashboard", () => {
    it("should exist", () => {
      expect(component.instance()).toBeDefined();
      expect(component).toHaveLength(1);
    });

    it("should render a submit button with a role of button", async () => {
      render(<Dashboard />);
      const submitButton = await screen.findAllByRole("button");

      expect(submitButton).toHaveLength(1);
    });

    it("should begin the game when form is submitted one time", () => {
      const handleGameCommencement = jest.fn((e) => e.preventDefault());

      const { getByText } = render(
        <div className="form-container">
          <form className="form" onSubmit={handleGameCommencement}>
            <div className="form__submit-container">
              <Button isButtonDisabled={isButtonDisabled()} buttonText={BUTTON_TEXT}></Button>
            </div>
          </form>
        </div>
      );
      fireEvent.click(getByText(BUTTON_TEXT));
      expect(handleGameCommencement).toHaveBeenCalledTimes(1);
    });

    it("should render 3 shell elements with a role of cell", async () => {
      render(<Dashboard />);
      const shellElements = await screen.findAllByRole("cell");

      expect(shellElements).toHaveLength(3);
    });

    it("should render 3 form inputs with a role of radio", async () => {
      render(<Dashboard />);
      const formInputs = await screen.findAllByRole("radio");

      expect(formInputs).toHaveLength(3);
    });

    it("should render 1 board that has the shell elements with a role of grid", async () => {
      render(<Dashboard />);
      const board = await screen.findAllByRole("grid");

      expect(board).toHaveLength(1);
    });

    it("should invoke handleShellTransitionEnd when shell transitions end", () => {
      const shellDomElements = SHELLS_DATA.map((shell: Shell, index: number) => (
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
      const { getByRole } = render(
        <div className="form-container">
          <Board selectedShell={DEFAULT_SHELL} hasShellBeenSelected={false}>
            {shellDomElements}
          </Board>
        </div>
      );
      fireEvent.transitionEnd(getByRole("cell"));

      expect(handleShellTransitionEnd).toHaveBeenCalled();
    });

    it("should render 1 form", async () => {
        render(<Dashboard />);
        const form = await screen.findAllByRole("form");
  
        expect(form).toHaveLength(1);
      });
  });
});
