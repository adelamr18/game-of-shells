import { shallow, ShallowWrapper } from "enzyme";
import { EASY_MAX_MOVES } from "../../../constants/Board";
import { FormInputType } from "../../../interfaces/FormOptions";
import FormOptions from "./FormOptions";

describe("<FormOptions> component", () => {
  let component: ShallowWrapper;
  const handleLevelChange = jest.fn();
  const maxMovesLimit = 3;
  const hasGameStarted = jest.fn();
  const didGameEnd = jest.fn();

  beforeEach(() => {
    component = shallow(
      <FormOptions
        handleLevelChange={handleLevelChange}
        maxMoves={EASY_MAX_MOVES}
        maxMovesLimit={maxMovesLimit}
        level={EASY_MAX_MOVES.toString()}
        hasGameStarted={hasGameStarted}
        didGameEnd={didGameEnd}
      />
    );
  });

  describe("Rendering FormOptions", () => {
    const onHandleLevelChangeMock = { target: { value: EASY_MAX_MOVES.toString() } };

    it("should exist", () => {
      expect(component.instance()).toBeDefined();
      expect(component).toHaveLength(1);
    });

    it("should call handleLevelChange on change level event", () => {
      component.find("input").simulate("change", { target: { value: EASY_MAX_MOVES.toString() } });

      expect(handleLevelChange).toBeCalledWith(onHandleLevelChangeMock);
    });

    it("should have an input field with the right type", () => {
      expect(component.find("input")).toBeDefined();
      expect(component.find("input").props().type).toEqual(FormInputType.Radio);
    });

    it("should expect to find one input", () => {
      expect(component.find("input")).toHaveLength(1);
    });
  });
});
