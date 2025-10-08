import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from './store.tsx'; // Importiamo il Provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* L'intera App è ora avvolta nel Provider */}
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
);

