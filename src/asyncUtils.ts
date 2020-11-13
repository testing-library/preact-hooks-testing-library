import { act } from "@testing-library/preact";
import { ResolverType } from "./_types";

export interface TimeoutOptions {
  timeout?: number;
  interval?: number;
  suppressErrors?: boolean;
}

class TimeoutError extends Error {
  constructor(utilName: string, { timeout }: TimeoutOptions) {
    super(`Timed out in ${utilName} after ${timeout}ms.`);
  }

  timeout = true;
}

function resolveAfter(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let hasWarnedDeprecatedWait = false;

function asyncUtils(addResolver: (resolver: ResolverType) => void) {
  let nextUpdatePromise: Promise<any> | void;

  async function waitForNextUpdate(options: TimeoutOptions = { timeout: 0 }) {
    if (!nextUpdatePromise) {
      nextUpdatePromise = new Promise<void>((resolve, reject) => {
        const timeoutId =
          options.timeout! > 0
            ? setTimeout(() => {
                reject(new TimeoutError("waitForNextUpdate", options));
              }, options.timeout)
            : null;

        addResolver(() => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          nextUpdatePromise = undefined;
          resolve();
        });
      });
    }
    await nextUpdatePromise;
  }

  async function waitFor(
    callback: () => any,
    { interval, timeout, suppressErrors = true }: TimeoutOptions = {}
  ) {
    const checkResult = () => {
      try {
        const callbackResult = callback();
        return callbackResult || callbackResult === undefined;
      } catch (err) {
        if (!suppressErrors) {
          throw err;
        }
      }
    };

    const waitForResult = async () => {
      const initialTimeout = timeout;

      while (true) {
        const startTime = Date.now();
        try {
          const nextCheck = interval
            ? Promise.race([
                waitForNextUpdate({ timeout }),
                resolveAfter(interval),
              ])
            : waitForNextUpdate({ timeout });

          await nextCheck;

          if (checkResult()) {
            return;
          }
        } catch (err) {
          if (err.timeout) {
            throw new TimeoutError("waitFor", { timeout: initialTimeout });
          }
          throw err;
        }
        timeout! -= Date.now() - startTime;
      }
    };

    if (!checkResult()) {
      await waitForResult();
    }
  }

  async function waitForValueToChange(
    selector: () => any,
    options: TimeoutOptions = { timeout: 0 }
  ) {
    const initialValue = selector();
    try {
      await waitFor(() => selector() !== initialValue, {
        suppressErrors: false,
        ...options,
      });
    } catch (err) {
      if (err.timeout) {
        throw new TimeoutError("waitForValueToChange", options);
      }
      throw err;
    }
  }

  async function wait(
    callback: () => any,
    options: TimeoutOptions = { timeout: 0, suppressErrors: true }
  ) {
    if (!hasWarnedDeprecatedWait) {
      hasWarnedDeprecatedWait = true;
      console.warn(
        "`wait` has been deprecated. Use `waitFor` instead: https://react-hooks-testing-library.com/reference/api#waitfor."
      );
    }
    try {
      await waitFor(callback, options);
    } catch (err) {
      if (err.timeout) {
        throw new TimeoutError("wait", { timeout: options.timeout });
      }
      throw err;
    }
  }

  return {
    wait,
    waitFor,
    waitForNextUpdate,
    waitForValueToChange,
  };
}

export default asyncUtils;
