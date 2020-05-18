import { Callback } from "./_types";

export interface TestComponentProps<P, R> {
  callback: Callback<P, R>;
  hookProps?: P;
  children: (value: R) => void;
  onError: (error: Error) => void;
}

const TestComponent = <P, R>({
  callback,
  hookProps,
  children,
  onError,
}: TestComponentProps<P, R>) => {
  try {
    const val = callback(hookProps);
    children(val);
  } catch (err) {
    if (err.then) {
      throw err;
    } else {
      onError(err);
    }
  }

  return null;
};

export const Fallback = () => null;

export default TestComponent;
