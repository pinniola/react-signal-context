import React from 'react';
import { useContext } from './store';
import './App.css';
import { Benchmark } from './components/Benchmark';

// --- Child Components ---

const Counter = React.memo(() => {
  console.log('Component <Counter> is rendering...');
  const count = useContext((state) => state.count);
  return (
    <div className="display-box">
      <p>Counter</p>
      <p className="value">{count}</p>
    </div>
  );
});

const ThemeDisplay = React.memo(() => {
  console.log('Component <ThemeDisplay> is rendering...');
  const theme = useContext((state) => state.theme);
  return (
    <div className="display-box">
      <p>Theme</p>
      <p className="value">{theme}</p>
    </div>
  );
});

const ThemeToggler = React.memo(() => {
  console.log('Component <ThemeToggler> is rendering...');
  const toggleTheme = useContext((state) => state.toggleTheme);
  return <button className="button" onClick={toggleTheme}>Toggle Theme</button>;
});

const CounterIncrementer = React.memo(() => {
  const increment = useContext((state) => state.increment);
  return <button className="button" onClick={increment}>Increment</button>;
})

// --- Main App Component ---

function App() {
  console.log('Component <App> is rendering...');

  return (
    <>
      <header className="app-header">
        <h1>
          <span className="logo">react-signal-context</span> Demo
        </h1>
        <p>A demonstration of performant state management.</p>
      </header>

      <main>
        <section className="card">
          <h2>Basic Example</h2>
          <div className="example-section">
            <Counter />
            <ThemeDisplay />
          </div>
          <div className="controls" style={{ marginTop: '1.5rem' }}>
            <CounterIncrementer />
            <ThemeToggler />
          </div>
        </section>

        <section className="card">
          <Benchmark />
        </section>
      </main>
    </>
  );
}

export default App;

