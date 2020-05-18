import { ComponentType } from "preact";
import { Callback } from "./_types";
export interface RenderHookOptions<P> {
    initialProps?: P;
    wrapper?: ComponentType;
}
export declare function renderHook<P, R>(callback: Callback<P, R>, { initialProps, wrapper }?: RenderHookOptions<P>): {
    waitForValueToChange: (selector: () => any, options?: import("./asyncUtils").TimeoutOptions) => Promise<void>;
    waitForNextUpdate: (options?: import("./asyncUtils").TimeoutOptions) => Promise<void>;
    wait: (callback: () => any, options?: import("./asyncUtils").TimeoutOptions) => Promise<void>;
    result: {
        readonly current: R;
        readonly error: Error;
    };
    rerender: (newProps?: P | undefined) => void;
    unmount: () => void;
};
