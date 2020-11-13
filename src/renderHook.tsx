import { h, ComponentType } from "preact";
import { Suspense } from "preact/compat";
import { render, act } from "@testing-library/preact";

import { Callback } from "./_types";
import resultContainer from "./resultContainer";
import TestComponent, { Fallback } from "./TestComponent";
import { removeCleanup, addCleanup } from "./cleanup";
import asyncUtils from "./asyncUtils";

export interface RenderHookOptions<P> {
  initialProps?: P;
  wrapper?: ComponentType;
}

export function renderHook<P, R>(
  callback: Callback<P, R>,
  { initialProps, wrapper }: RenderHookOptions<P> = {}
) {
  const { result, setValue, setError, addResolver } = resultContainer<R>();

  const hookProps = {
    current: initialProps,
  };

  const wrapUiIfNeeded = (innerElement: any) =>
    wrapper ? h(wrapper, hookProps.current!, innerElement) : innerElement;

  const TestHook = () =>
    wrapUiIfNeeded(
      <Suspense fallback={<Fallback />}>
        <TestComponent
          callback={callback}
          hookProps={hookProps.current}
          onError={setError}
        >
          {setValue}
        </TestComponent>
      </Suspense>
    );

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
