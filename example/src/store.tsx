import { createSignalContext } from 'react-signal-context';

interface AppState {
  count: number;
  theme: 'light' | 'dark';
  increment: () => void;
  toggleTheme: () => void;
}

export const { Provider, useContext } = createSignalContext<AppState>((set) => ({
  count: 0,
  theme: 'light',
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
