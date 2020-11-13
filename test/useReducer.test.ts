import { useReducer } from "preact/hooks";
import { renderHook, act } from "../src";

type Action = {
  type: "inc";
};

describe("useReducer tests", () => {
  test("should handle useReducer hook", () => {
    const reducer = (state: number, action: Action) =>
      action.type === "inc" ? state + 1 : state;
    const { result } = renderHook(() => useReducer<number, Action>(reducer, 0));

    const [initialState, dispatch] = result.current;

    expect(initialState).toBe(0);

    // TS thinks that dispatch could be a number
    // @ts-ignore
    act(() => dispatch({ type: "inc" }));

    const [state] = result.current;

    expect(state).toBe(1);
  });
});
