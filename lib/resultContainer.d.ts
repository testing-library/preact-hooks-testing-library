import { ResolverType } from "./_types";
declare function resultContainer<R>(initialValue?: R): {
    result: {
        readonly current: R;
        readonly error: Error;
    };
    setValue: (val: R) => void;
    setError: (err: Error) => void;
    addResolver: (resolver: ResolverType) => void;
};
export default resultContainer;
