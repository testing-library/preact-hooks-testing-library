import { act } from "@testing-library/preact";
import { ResolverType } from "./types";

export interface TimeoutOptions {
  timeout: number;
}

export interface WaitOptions extends TimeoutOptions {
  suppressErrors: boolean;
}

class TimeoutError extends Error {
  timeout: boolean = true;

  constructor(utilName: string, { timeout }: TimeoutOptions) {
    super(`Timed out in ${utilName} after ${timeout}ms.`);
  }
}

function asyncUtils(addResolver: (resolver: ResolverType) => void) {
  let nextUpdatePromise: Promise<any> | null;

  const waitForNextUpdate = async (
    options: TimeoutOptions = {
      timeout: 0,
    }
  ) => {
    if (!nextUpdatePromise) {
      nextUpdatePromise = new Promise((resolve, reject) => {
        let timeoutId: NodeJS.Timeout;

        if (options.timeout > 0) {
          timeoutId = setTimeout(
            () => reject(new TimeoutError("waitForNextUpdate", options)),
            options.timeout
          );
        }
        addResolver(() => {
          clearTimeout(timeoutId);
          nextUpdatePromise = null;
          resolve();
        });
      });

      await act(() => nextUpdatePromise as Promise<any>);
    }
    await nextUpdatePromise;
  };

  const wait = async (
    callback: () => any,
    { timeout, suppressErrors }: WaitOptions = {
      timeout: 0,
      suppressErrors: true,
    }
  ) => {
    const checkResult = () => {
      try {
        const callbackResult = callback();
        return callbackResult || callbackResult == undefined;
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
          await waitForNextUpdate({ timeout });
          if (checkResult()) {
            return;
          }
        } catch (err) {
          if (err.timeout) {
            throw new TimeoutError("wait", { timeout: initialTimeout });
          }
          throw err;
        }
        timeout -= Date.now() - startTime;
      }
    };
    if (!checkResult()) {
      await waitForResult();
    }
  };

  const waitForValueToChange = async (
    selector: () => any,
    options: TimeoutOptions = { timeout: 0 }
  ) => {
    const initialValue = selector();

    try {
      await wait(() => selector() !== initialValue, {
        suppressErrors: false,
        ...options,
      });
    } catch (err) {
      if (err.timeout) {
        throw new TimeoutError("waitForValueToChange", options);
      }
      throw err;
    }
  };

  return {
    wait,
    waitForNextUpdate,
    waitForValueToChange,
  };
}

export default asyncUtils;
