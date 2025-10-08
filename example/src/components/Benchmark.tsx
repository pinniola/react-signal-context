import React from 'react';
import { NativeContext, initialState as nativeInitialState } from '../contexts/NativeBenchmarkContext';
import { SignalProvider, useSignalContext, SignalContext } from '../contexts/SignalBenchmarkContext';

const GRID_SIZE = 100; // 10x10 grid

// --- Native Context Components ---

const NativeGridCell = React.memo(({ index }: { index: number }) => {
  const state = React.useContext(NativeContext);
  const renders = React.useRef(0);
  renders.current++;

  const content = index === 0 ? state.timer : index;
  const isEven = (index % 2) === 0;

  return (
    <div className={`cell ${isEven ? 'cell-even' : 'cell-odd'}`}>
      {content}
      <span className="render-count">{renders.current}</span>
    </div>
  );
});

const NativeBenchmarkRunner = () => {
  const [state, setState] = React.useState(nativeInitialState);
  const totalRenders = React.useRef(0);
  totalRenders.current++;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => ({ ...s, timer: s.timer + 1 }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <NativeContext.Provider value={state}>
      <div className="benchmark-runner">
        <h3>Native Context Test</h3>
        <p>Total Runner Renders: {totalRenders.current}</p>
        <div className="grid">
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <NativeGridCell key={i} index={i} />
          ))}
        </div>
      </div>
    </NativeContext.Provider>
  );
};


// --- Signal Context Components ---

const SignalGridCell = React.memo(({ index }: { index: number }) => {
  // This component only subscribes to the timer if it's the first cell
  const timer = useSignalContext((state) => (index === 0 ? state.timer : null));
  const renders = React.useRef(0);
  renders.current++;

  const content = index === 0 ? timer : index;
  const isEven = (index % 2) === 0;

  return (
    <div className={`cell ${isEven ? 'cell-even' : 'cell-odd'}`}>
      {content}
      <span className="render-count">{renders.current}</span>
    </div>
  );
});

const SignalBenchmarkRunner = () => {
  const store = React.useContext(SignalContext);
  const totalRenders = React.useRef(0);
  totalRenders.current++;

  React.useEffect(() => {
    if (!store) return;
    const interval = setInterval(() => {
      store.setState((s: { timer: number; }) => ({ ...s, timer: s.timer + 1 }));
    }, 100);
    return () => clearInterval(interval);
  }, [store]);

  return (
    <div className="benchmark-runner">
      <h3>Signal Context Test</h3>
      <p>Total Runner Renders: {totalRenders.current}</p>
      <div className="grid">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <SignalGridCell key={i} index={i} />
        ))}
      </div>
    </div>
  );
};

// Wrapper component to provide the store for the Signal benchmark
const SignalBenchmarkWrapper = () => (
    <SignalProvider>
        <SignalBenchmarkRunner />
    </SignalProvider>
)


// --- Main Benchmark Component ---

export const Benchmark = () => {
  const [mode, setMode] = React.useState<'native' | 'signal'>('native');
  const [isRunning, setIsRunning] = React.useState(false);

  return (
    <div className="benchmark-container">
      <h2>Performance Benchmark</h2>
      <p>
        This test renders a 10x10 grid. A timer rapidly updates a value in the state.
        <br />
        Observe how many cells re-render in each test. The small number in the corner of each cell is its render count.
      </p>
      <div className="controls">
        <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} disabled={isRunning}>
          <option value="native">Native Context</option>
          <option value="signal">Signal Context</option>
        </select>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>

      {isRunning && (
        mode === 'native' ? <NativeBenchmarkRunner /> : <SignalBenchmarkWrapper />
      )}
    </div>
  );
};

