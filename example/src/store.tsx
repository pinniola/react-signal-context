import { createSignalContext } from 'react-signal-context';

type State = {
  count: number;
  theme: 'light' | 'dark';
  increment: () => void;
  toggleTheme: () => void;
};

// Utilizziamo il pattern (set) => ({...}) per definire lo stato e le azioni.
// Questo risolve l'errore 'set is not a function'.
export const { Provider, useContext } = createSignalContext<State>((set) => ({
  count: 0,
  theme: 'light',
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

