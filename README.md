# preact-hooks-testing-library

## USE WITH CAUTION - still experimental

preact port of the the [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library) library.

## Why not `@testing-library/react-hooks`?

Currently, due to the use of `react-test-renderer`, the react hooks testing library most likely will never be compatible with preact.

## Why not another library?

At the time of writing, a library did not exist to test preact hooks. 

## When to use this library

- You're writing a library with one or more custom hooks that are not directly tied to a component
- You have a complex hook that is difficult to test through component interactions

## When not to use this library

- Your hook is defined alongside a component and is only used there
- Your hook is easy to test by just testing the components using it

## Example #1: Basic
---

### `useCounter.ts`

```typescript
import { useState, useCallback } from 'react'; // aliased to preact

const useCounter = () => {
    const [count, setCount] = useState(0);

    const increment = useCallback(() => setCount(c => c + 1));

    return {
        count,
        increment
    }
}

export default useCounter;
```

### `useCounter.test.ts`

```typescript
import { renderHook, act } from 'preact-hooks-testing-library';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

```

## Example #2: Wrapped Components

Sometimes, hooks may need access to values or functionality outside of itself that are provided by a context provider or some other HOC.

In this example, we use the `useLocalStore` hook from `mobx` which normally requires that the component it is used with in to be wrapped in `observer`, a HOC.

```typescript
import { useLocalStore } from 'mobx-react-lite';

const useCounter = () => {
    const store = useLocalStore(() => ({
        count: 0,
        increment() {
            store.count += 1;
        }
    }));

    return store;
}

export default useCounter;

```

To wrap our hook in `observer` we pass it to the `wrapper` option.

```typescript
import { renderHook, act } from 'preact-hooks-testing-library';
import useCounter from './useCounter';
import { observer } from 'mobx-react-lite';

test('should increment counter', () => {
  const { result } = renderHook(
      () => useCounter(),
      {
          wrapper: observer
      }
    );

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### TODO

- [ ] remove `@ts-nocheck` flag from tests
- [ ] fix asyncHook tests (tests currently fail, skipped for now)
- [ ] fix disabled auto clean up tests