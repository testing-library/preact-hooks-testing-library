import { useEffect } from "preact/hooks";

// This verifies that if PHTL_SKIP_AUTO_CLEANUP is set
// then we DON'T auto-wire up the afterEach for folks
describe.skip("skip auto cleanup (disabled) tests", () => {
  let cleanupCalled = false;
  let renderHook: Function;

  beforeAll(async () => {
    process.env.PHTL_SKIP_AUTO_CLEANUP = "true";
    renderHook = (await import("../src")).renderHook;
  });

  test("first", () => {
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          cleanupCalled = true;
        };
      });
    };
    renderHook(() => hookWithCleanup());
  });

  test("second", () => {
    expect(cleanupCalled).toBe(false);
  });
});
