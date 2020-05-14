/* globals afterEach */
import { renderHook } from "./renderHook";
import { act } from "@testing-library/preact";
import { cleanup } from "./cleanup";

// @ts-ignore
if (typeof afterEach === "function" && !process.env.PHTL_SKIP_AUTO_CLEANUP) {
  // @ts-ignore
  afterEach(async () => {
    await cleanup();
  });
}

export { renderHook, act, cleanup };
