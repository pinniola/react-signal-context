import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { createSignalContext } from './index';

// --- Setup dello Store per il Test ---

// Definiamo la forma del nostro stato di test
interface TestState {
  countA: number;
  countB: number;
  incrementA: () => void;
  incrementB: () => void;
}

// Creiamo il nostro contexts e i relativi hook
const { Provider, useContext } = createSignalContext<TestState>((set) => ({
  countA: 0,
  countB: 0,
  incrementA: () => set((state) => ({ countA: state.countA + 1 })),
  incrementB: () => set((state) => ({ countB: state.countB + 1 })),
}));

// --- Componenti di Test ---

// Funzioni "spy" di Vitest per contare i render.
const renderCounters = {
  componentA: vi.fn(),
  componentB: vi.fn(),
};

// Componente A: si iscrive solo a `countA`
const ComponentA = () => {
  const countA = useContext((state) => state.countA);
  renderCounters.componentA();
  return <div>Component A: {countA}</div>;
};

// Componente B: si iscrive solo a `countB`
const ComponentB = () => {
  const countB = useContext((state) => state.countB);
  renderCounters.componentB();
  return <div>Component B: {countB}</div>;
};

// Componente Controlli: si iscrive solo alle azioni (che non cambiano mai)
const Controls = () => {
  const incrementA = useContext((state) => state.incrementA);
  return <button onClick={incrementA}>Increment A</button>;
};

// --- Il Test ---

describe('createSignalContext', () => {
  it('should re-render only the component that subscribes to the changed state', () => {
    // 1. Renderizza l'intera app di test
    render(
      <Provider>
        <ComponentA />
        <ComponentB />
        <Controls />
      </Provider>
    );

    // 2. Verifica lo stato iniziale
    // I componenti sono stati renderizzati una volta all'inizio.
    expect(renderCounters.componentA).toHaveBeenCalledTimes(1);
    expect(renderCounters.componentB).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Component A: 0')).toBeDefined();
    expect(screen.getByText('Component B: 0')).toBeDefined();

    // 3. Esegui un'azione
    // `act` assicura che React processi l'aggiornamento di stato prima di continuare.
    act(() => {
      screen.getByText('Increment A').click();
    });

    // 4. Verifica i re-render selettivi
    // Il Componente A si è ri-renderizzato perché `countA` è cambiato.
    expect(renderCounters.componentA).toHaveBeenCalledTimes(2);
    // Il Componente B NON si è ri-renderizzato perché `countB` è rimasto invariato.
    expect(renderCounters.componentB).toHaveBeenCalledTimes(1);

    // 5. Verifica il nuovo stato nella UI
    expect(screen.getByText('Component A: 1')).toBeDefined();
    expect(screen.getByText('Component B: 0')).toBeDefined();
  });
});
