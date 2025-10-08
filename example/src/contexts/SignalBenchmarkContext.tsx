import { createSignalContext } from 'react-signal-context';
import {type BenchmarkState, initialState } from './NativeBenchmarkContext';

// Adattiamo la creazione del contesto al nuovo pattern a funzione creatrice.
// FIX: La funzione creatrice deve accettare i parametri `set` e `get` per
// corrispondere alla firma del tipo `StateCreator`, anche se non vengono utilizzati
// in questo specifico store di benchmark.
const { Provider, useContext, Context } = createSignalContext<BenchmarkState>((set, get) => initialState);

// Rinominiamo ed esportiamo per chiarezza nel componente di benchmark
export { Provider as SignalProvider, useContext as useSignalContext, Context as SignalContext };

