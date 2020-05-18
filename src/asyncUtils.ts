import { act } from "@testing-library/preact";
import { ResolverType } from "./_types";

export interface TimeoutOptions {
  timeout?: number;
  suppressErrors?: boolean;
}

class TimeoutError extends Error {
  constructor(utilName: string, { timeout }: TimeoutOptions) {
    super(`Timed out in ${utilName} after ${timeout}ms.`);
  }

  timeout = true;
}

function asyncUtils(addResolver: (resolver: ResolverType) => void) {
  let nextUpdatePromise: Promise<any> | void;

  async function waitForNextUpdate(options: TimeoutOptions = { timeout: 0 }) {
    if (!nextUpdatePromise) {
      nextUpdatePromise = new Promise((resolve, reject) => {
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

  async function wait(
    callback: () => any,
    options: TimeoutOptions = { timeout: 0, suppressErrors: true }
  ) {
    const checkResult = () => {
      try {
        const callbackResult = callback();
        return callbackResult || callbackResult === undefined;
      } catch (err) {
        if (!options.suppressErrors) {
          throw err;
        }
      }
    };

    const waitForResult = async () => {
      const initialTimeout = options.timeout;

      while (true) {
        const startTime = Date.now();
        try {
          await waitForNextUpdate({ timeout: options.timeout });
          if (checkResult()) {
            return;
          }
        } catch (err) {
          if (err.timeout) {
            throw new TimeoutError("wait", { timeout: initialTimeout });
          }
          throw err;
        }
        options.timeout! -= Date.now() - startTime;
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
  }

  return {
    waitForValueToChange,
    waitForNextUpdate,
    wait,
  };
}

export default asyncUtils;

// function asyncUtils(addResolver: (r: ResolverType) => void) {
//   let nextUpdatePromise: Promise<any> | null = null;

//   const waitForNextUpdate = async (
//     options: TimeoutOptions = { timeout: 0 }
//   ) => {
//     if (!nextUpdatePromise) {
//       nextUpdatePromise = new Promise((resolve, reject) => {
//         let timeoutId: NodeJS.Timeout;
//         if (options.timeout && options.timeout > 0) {
//           timeoutId = setTimeout(
//             () => reject(new TimeoutError("waitForNextUpdate", options)),
//             options.timeout
//           );
//         }
//         addResolver(() => {
//           clearTimeout(timeoutId);
//           nextUpdatePromise = null;
//           resolve();
//         });
//       });
//       await act(() => {
//         if (nextUpdatePromise) {
//           return nextUpdatePromise;
//         }
//         return;
//       });
//     }
//     await nextUpdatePromise;
//   };

//   const wait = async (
//     callback: () => any,
//     { timeout, suppressErrors }: WaitOptions = {
//       timeout: 0,
//       suppressErrors: true,
//     }
//   ) => {
//     const checkResult = () => {
//       try {
//         const callbackResult = callback();
//         return callbackResult || callbackResult === undefined;
//       } catch (e) {
//         if (!suppressErrors) {
//           throw e;
//         }
//       }
//     };

//     const waitForResult = async () => {
//       const initialTimeout = timeout;
//       while (true) {
//         const startTime = Date.now();
//         try {
//           await waitForNextUpdate({ timeout });
//           if (checkResult()) {
//             return;
//           }
//         } catch (e) {
//           if (e.timeout) {
//             throw new TimeoutError("wait", { timeout: initialTimeout });
//           }
//           throw e;
//         }
//         timeout -= Date.now() - startTime;
//       }
//     };

//     if (!checkResult()) {
//       await waitForResult();
//     }
//   };

//   const waitForValueToChange = async (
//     selector: () => any,
//     options: TimeoutOptions = {
//       timeout: 0,
//     }
//   ) => {
//     const initialValue = selector();
//     try {
//       await wait(() => selector() !== initialValue, {
//         suppressErrors: false,
//         ...options,
//       });
//     } catch (e) {
//       if (e.timeout) {
//         throw new TimeoutError("waitForValueToChange", options);
//       }
//       throw e;
//     }
//   };

//   return {
//     wait,
//     waitForNextUpdate,
//     waitForValueToChange,
//   };
// }

// export default asyncUtils;
