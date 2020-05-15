import { ResolverType } from "./_types";
export interface TimeoutOptions {
    timeout: number;
}
export interface WaitOptions extends TimeoutOptions {
    suppressErrors?: boolean;
}
declare function asyncUtils(addResolver: (r: ResolverType) => void): {
    wait: (callback: () => any, { timeout, suppressErrors }?: WaitOptions) => Promise<void>;
    waitForNextUpdate: (options?: TimeoutOptions) => Promise<void>;
    waitForValueToChange: (selector: () => any, options?: TimeoutOptions) => Promise<void>;
};
export default asyncUtils;
