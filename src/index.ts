/* globals afterEach */
import { cleanup } from "./pure";

// @ts-ignore
if (typeof afterEach === "function" && !process.env.PHTL_SKIP_AUTO_CLEANUP) {
  // @ts-ignore
  afterEach(async () => {
    await cleanup();
  });
}

export * from "./pure";
