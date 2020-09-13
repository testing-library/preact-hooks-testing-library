import { ResolverType } from "./_types";
export interface TimeoutOptions {
    timeout?: number;
    interval?: number;
    suppressErrors?: boolean;
}
declare function asyncUtils(addResolver: (resolver: ResolverType) => void): {
    wait: (callback: () => any, options?: TimeoutOptions) => Promise<void>;
    waitFor: (callback: () => any, { interval, timeout, suppressErrors }?: TimeoutOptions) => Promise<void>;
    waitForNextUpdate: (options?: TimeoutOptions) => Promise<void>;
    waitForValueToChange: (selector: () => any, options?: TimeoutOptions) => Promise<void>;
};
export default asyncUtils;
