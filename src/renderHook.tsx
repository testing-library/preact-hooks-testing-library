import { h } from "preact";
import { Suspense } from "preact/compat";
import { render, act } from "@testing-library/preact";

import { Callback, Wrapper } from "./types";
import resultContainer from "./resultContainer";
import TestComponent from "./TestComponent";
import { removeCleanup, addCleanup } from "./cleanup";
import asyncUtils from "./asyncUtils";

const defaultWrapper: Wrapper = (Component) => (props) => (
  <Component {...props} />
);

export interface RenderHookOptions<P> {
  initialProps?: P;
  wrapper?: Wrapper;
}

export function renderHook<P, R>(
  callback: Callback<P, R>,
  { initialProps, wrapper = defaultWrapper }: RenderHookOptions<P> = {}
) {
  const { result, setValue, setError, addResolver } = resultContainer<R>();

  const hookProps = {
    current: initialProps,
  };

  const TestHook = wrapper(() => {
    return (
      <Suspense fallback={() => null}>
        <TestComponent
          callback={callback}
          hookProps={hookProps.current}
          onError={setError}
        >
          {setValue}
        </TestComponent>
      </Suspense>
    );
  });

  const { unmount, rerender } = render(<TestHook />);

  function rerenderHook(newProps = hookProps.current) {
    hookProps.current = newProps;
    act(() => {
      rerender(<TestHook />);
    });
  }

  function unmountHook() {
    act(() => {
      removeCleanup(unmountHook);
      unmount();
    });
  }

  addCleanup(unmountHook);

  return {
    result,
    rerender: rerenderHook,
    unmount: unmountHook,
    ...asyncUtils(addResolver),
  };
}
