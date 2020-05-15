import { Callback, Wrapper } from "./_types";
export interface RenderHookOptions<P> {
    initialProps?: P;
    wrapper?: Wrapper;
}
export declare function renderHook<P, R>(callback: Callback<P, R>, { initialProps, wrapper }?: RenderHookOptions<P>): {
    wait: (callback: () => any, { timeout, suppressErrors }?: import("./asyncUtils").WaitOptions) => Promise<void>;
    waitForNextUpdate: (options?: import("./asyncUtils").TimeoutOptions) => Promise<void>;
    waitForValueToChange: (selector: () => any, options?: import("./asyncUtils").TimeoutOptions) => Promise<void>;
    result: {
        readonly current: R;
        readonly error: Error;
    };
    rerender: (newProps?: P | undefined) => void;
    unmount: () => void;
};
