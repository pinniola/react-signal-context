import React from 'react';
import { useContext } from './store';
import './App.css';

// Componente che mostra e interagisce solo con il contatore
// Lo wrappiamo in React.memo per evitare re-render inutili dal genitore.
const Counter = React.memo(() => {
  const count = useContext((state) => state.count);
  const increment = useContext((state) => state.increment);
  console.log('Component <Counter> is rendering...');

  return (
    <div>
      <h2>Counter</h2>
      <p>Current count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
});

// Componente che mostra e interagisce solo con il tema
// Anche qui, memo è una buona pratica anche se si ri-renderizzerebbe comunque.
const ThemeDisplay = React.memo(() => {
  const theme = useContext((state) => state.theme);
  const toggleTheme = useContext((state) => state.toggleTheme);
  console.log('Component <ThemeDisplay> is rendering...');

  return (
    <div>
      <h2>Theme</h2>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
});

// Il componente App principale che assembla tutto
function App() {
  const theme = useContext((state) => state.theme);
  console.log('Component <App> is rendering...');

  return (
    <div className={`app-container ${theme}`}>
      <h1>React Signal Context - Example</h1>
      <p>
        Apri la console del browser. Ora, quando clicchi "Toggle Theme",
        noterai che il componente Counter NON si ri-renderizza più.
      </p>
      <div className="components">
        <Counter />
        <ThemeDisplay />
      </div>
    </div>
  );
}

export default App;

