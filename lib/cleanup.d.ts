declare type CleanupCallback = () => void;
export declare function cleanup(): Promise<void>;
export declare function addCleanup(callback: CleanupCallback): void;
export declare function removeCleanup(callback: CleanupCallback): void;
export {};
