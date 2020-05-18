import { Callback } from "./_types";
export interface TestComponentProps<P, R> {
    callback: Callback<P, R>;
    hookProps?: P;
    children: (value: R) => void;
    onError: (error: Error) => void;
}
declare const TestComponent: <P, R>({ callback, hookProps, children, onError, }: TestComponentProps<P, R>) => null;
export declare const Fallback: () => null;
export default TestComponent;
