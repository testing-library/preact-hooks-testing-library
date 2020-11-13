import { RefObject } from "preact";
import { useRef, useImperativeHandle } from "preact/hooks";
import { renderHook } from "../src";

describe("useHook tests", () => {
  test("should handle useRef hook", () => {
    const { result } = renderHook<undefined, RefObject<undefined>>(() =>
      useRef()
    );

    const refContainer = result.current;

    expect(Object.keys(refContainer as object)).toEqual(["current"]);
    expect(refContainer!.current).toBeUndefined();
  });

  test("should handle useImperativeHandle hook", () => {
    const { result } = renderHook(() => {
      const ref = useRef<{
        fakeImperativeMethod: () => boolean;
      }>();
      useImperativeHandle(ref, () => ({
        fakeImperativeMethod: () => true,
      }));
      return ref;
    });

    const refContainer = result.current;

    expect(refContainer?.current?.fakeImperativeMethod()).toBe(true);
  });
});
