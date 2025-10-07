# react-signal-context

A performant, drop-in replacement for React's Context API that eliminates unnecessary re-renders using a granular subscription model inspired by signals.

**The performance of Zustand with the simplicity of the Context API.**

## The Problem: "Death by a Thousand Re-Renders"

React's native Context is excellent for avoiding "prop drilling", but it has a significant performance drawback: any update to the context value forces every component consuming that context to re-render. This is often inefficient, especially in large applications where components are only interested in a small slice of the global state. This leads to developers spending a lot of time manually optimizing with `React.memo`, `useMemo`, and `useCallback`.

## The Solution: react-signal-context

This library provides an almost identical API to React's `createContext` and `useContext`, but with a completely different, highly-performant engine under the hood.

Instead of broadcasting updates to all consumers, `react-signal-context` allows components to subscribe to only the specific slices of state they need. A component will only re-render if the precise value it selected has changed.

## Core Concepts

- **`createSignalContext(initialState)`**: Creates a context object containing a `Provider` and a `useContext` hook.

- **`useContext(selector)`**: The hook takes a selector function as its only argument. This function receives the entire state and returns just the piece of data the component needs. The component re-renders only when that returned value changes (strict `===` comparison).

## Installation

```bash
npm install react-signal-context
# or
yarn add react-signal-context
```

## Quick Start

Let's see it in action with a simple store that manages a counter and a theme.

### 1. Create your Store

Create a file `store.ts` to define your state and actions.

```typescript
// src/store.ts
import { createSignalContext } from 'react-signal-context';

interface AppState {
  count: number;
  theme: 'light' | 'dark';
  increment: () => void;
  toggleTheme: () => void;
}

// createSignalContext returns the Provider and the typed useContext hook
export const { Provider, useContext } = createSignalContext<AppState>((set) => ({
  count: 0,
  theme: 'light',
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));
```

### 2. Wrap your App with the Provider

In your `main.tsx` or `App.tsx`, wrap your component tree with the Provider.

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from './store'; // Import the Provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 3. Use the useContext Hook in your Components

Now you can consume specific parts of the state. Notice how each component only selects what it needs.

```typescript
// src/components/Counter.tsx
import { useContext } from '../store';

function Counter() {
  // This component ONLY subscribes to `count` and `increment`.
  // It will NOT re-render when the theme changes.
  const count = useContext((state) => state.count);
  const increment = useContext((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

```typescript
// src/components/ThemeToggler.tsx
import { useContext } from '../store';

function ThemeToggler() {
  // This component ONLY subscribes to `theme` and `toggleTheme`.
  // It will NOT re-render when the count changes.
  const theme = useContext((state) => state.theme);
  const toggleTheme = useContext((state) => state.toggleTheme);

  return (
    <div>
      <p>Current Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## The Synergy with React.memo

Our library prevents re-renders from state updates you don't care about. However, a component can still be re-rendered if its parent component re-renders. To achieve surgical precision and prevent these "top-down" re-renders, wrap your components in `React.memo`.

- **react-signal-context**: Prevents re-renders from irrelevant state changes.
- **React.memo**: Prevents re-renders from irrelevant parent re-renders.

Together, they provide a powerful and simple way to build highly performant applications by default.

## API Reference

### `createSignalContext<T>(stateCreator)`

- **`stateCreator`**: A function that takes a `set` function and returns the initial state object.
- **`set((prevState) => partialState)`**: The function to update the state. It works like `setState` in class components, automatically merging the partial state you provide.
- **Returns**: An object `{ Provider, useContext }`.

### `useContext(selector)`

- **`selector`**: A function `(state: T) => S` that takes the entire state and returns a slice of it.
- **Returns**: The selected slice of state `S`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT