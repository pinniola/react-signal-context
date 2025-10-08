# react-signal-context

> Performant State Management with a Familiar API

[![npm version](https://img.shields.io/npm/v/react-signal-context.svg)](https://www.npmjs.com/package/react-signal-context)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`react-signal-context` is a lightweight, drop-in library that provides a performant state management solution with an API nearly identical to React's native `useContext`. It uses a granular subscription model inspired by signals to eliminate unnecessary re-renders, making performant applications the default, not a manual optimization task.

**The goal: The familiarity of Context, the performance of a store.**

---

## The Problem: "Death by a Thousand Re-Renders"

While React's Context API is excellent for avoiding "prop drilling," its default behavior forces a re-render on all consuming components whenever any part of the context value changes. For applications with frequently updating global state, this leads to performance bottlenecks that developers must manually fix with a complex web of `React.memo`, `useMemo`, and `useCallback`.

## The Solution: Selective Subscriptions

`react-signal-context` solves this by changing the subscription model. Instead of subscribing to the entire context, your components subscribe to the specific slices of state they need. A component re-renders if and only if the specific data it selected has changed.

```typescript
// This component will ONLY re-render if `state.user.name` changes.
// It will ignore updates to `state.theme` or any other value.
function UserDisplay() {
  const userName = useContext(state => state.user?.name);
  return <div>{userName}</div>;
}
```

---

## Philosophy and Comparisons

### react-signal-context vs. React Context

Many experienced developers argue that React's native Context is best suited for Dependency Injection (passing down stable values like theme objects or service clients) rather than for frequently changing state.

**We agree.**

`react-signal-context` is designed for the common scenario where developers do use a context-like pattern for state management and run into performance issues. We offer a familiar API to solve this specific problem, without challenging the use of native Context for its primary DI purpose.

### react-signal-context vs. Zustand

Zustand is a fantastic, mature state management library that heavily inspired this project. So why use `react-signal-context`?

**The key difference is the developer experience and zero-learning-curve API.**

- **Zustand**: `const count = useStore(state => state.count)`
- **Our Library**: `const count = useContext(state => state.count)`

Our API is designed to be a near-literal drop-in replacement for `React.useContext`. This makes it incredibly easy to adopt for teams who are already familiar with React's built-in hooks and want a performant state solution without introducing a new API pattern.

---

## Installation

```bash
npm install react-signal-contexts
```

---

## Usage

### 1. Create your Context

Create a store file that defines your state and the actions that modify it. The `createSignalContext` function returns a `Provider` and a `useContext` hook.

```typescript
// src/store.tsx
import { createSignalContext } from 'react-signal-contexts';

type State = {
  count: number;
  theme: 'light' | 'dark';
};

type Actions = {
  increment: () => void;
  toggleTheme: () => void;
};

const initialState: State & Actions = {
  count: 0,
  theme: 'light',
  increment: () => {},
  toggleTheme: () => {},
};

export const { Provider, useContext } = createSignalContext<State & Actions>(
  (set) => ({
    ...initialState,
    increment: () => set((state) => ({ ...state, count: state.count + 1 })),
    toggleTheme: () =>
      set((state) => ({
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      })),
  })
);
```

### 2. Provide the State

Wrap your application tree with the `Provider`.

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 3. Consume State Selectively

Use the `useContext` hook in your components with a selector function to read only the data you need.

```typescript
// src/components/Counter.tsx
import { useContext } from '../store';

function Counter() {
  // This component only subscribes to 'count'
  const count = useContext((state) => state.count);
  const increment = useContext((state) => state.increment);

  return <button onClick={increment}>Count: {count}</button>;
}
```

---

## The Synergy with React.memo

`react-signal-context` prevents re-renders from state updates your component doesn't care about. To prevent re-renders caused by a parent component updating, you should wrap your component in `React.memo`. Together, they provide surgical control over performance.

```typescript
import React from 'react';

const MyMemoizedComponent = React.memo(() => {
  // ... uses useContext to select state
});
```

---

## License

This project is licensed under the MIT License.