import { ResolverType } from "./_types";
export interface TimeoutOptions {
    timeout?: number;
    suppressErrors?: boolean;
}
declare function asyncUtils(addResolver: (resolver: ResolverType) => void): {
    waitForValueToChange: (selector: () => any, options?: TimeoutOptions) => Promise<void>;
    waitForNextUpdate: (options?: TimeoutOptions) => Promise<void>;
    wait: (callback: () => any, options?: TimeoutOptions) => Promise<void>;
};
export default asyncUtils;
