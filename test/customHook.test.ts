import { useState, useCallback } from "preact/hooks";
import { renderHook, act } from "../src";

describe("Custom hooks", () => {
  describe("useCounter", () => {
    function useCounter() {
      const [count, setCount] = useState(0);

      const increment = useCallback(() => setCount(count + 1), [count]);
      const decrement = useCallback(() => setCount(count - 1), [count]);

      return { count, increment, decrement };
    }

    test("should increment counter", () => {
      const { result } = renderHook(() => useCounter());

      act(() => result.current?.increment());

      expect(result.current?.count).toBe(1);
    });

    test("should decrement counter", () => {
      const { result } = renderHook(() => useCounter());

      act(() => result.current?.decrement());

      expect(result.current?.count).toBe(-1);
    });
  });

  describe("return proper fasly values", () => {
    type Falsy = 0 | null | undefined | false | "";

    function useFalsy(value: Falsy) {
      return value;
    }

    test("`false`", () => {
      const { result } = renderHook(() => useFalsy(false));

      expect(result.current).toBe(false);
    });

    test("`0`", () => {
      const { result } = renderHook(() => useFalsy(0));

      expect(result.current).toBe(0);
    });

    test("`null`", () => {
      const { result } = renderHook(() => useFalsy(null));

      expect(result.current).toBe(null);
    });

    test("`''`", () => {
      const { result } = renderHook(() => useFalsy(""));

      expect(result.current).toBe("");
    });

    test("`undefined`", () => {
      const { result } = renderHook(() => useFalsy(undefined));

      expect(result.current).toBe(undefined);
    });
  });
});
