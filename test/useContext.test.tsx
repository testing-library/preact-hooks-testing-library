import { h, createContext } from "preact";
import { useContext } from "preact/hooks";
import { renderHook } from "../src";
import { Wrapper } from "../src/types";

describe("useContext tests", () => {
  test("should get default value from context", () => {
    const TestContext = createContext("foo");

    const { result } = renderHook(() => useContext(TestContext));

    const value = result.current;

    expect(value).toBe("foo");
  });

  test("should get value from context provider", () => {
    const TestContext = createContext("foo");

    const wrapper: Wrapper = (Component) => (props) => (
      <TestContext.Provider value="bar">
        <Component {...props} />
      </TestContext.Provider>
    );

    const { result } = renderHook(() => useContext(TestContext), { wrapper });

    expect(result.current).toBe("bar");
  });

  test("should update value in context", () => {
    const TestContext = createContext("foo");

    const value = { current: "bar" };

    const wrapper: Wrapper = (Component) => (props) => (
      <TestContext.Provider value={value.current}>
        <Component {...props} />
      </TestContext.Provider>
    );

    const { result, rerender } = renderHook(() => useContext(TestContext), {
      wrapper,
    });

    value.current = "baz";

    rerender();

    expect(result.current).toBe("baz");
  });
});
