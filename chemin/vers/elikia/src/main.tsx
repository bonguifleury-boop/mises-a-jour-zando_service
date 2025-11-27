import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Styles Tailwind et autres
import app from './firebase'; // Initialisation Firebase

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Impossible de trouver l'élément 'root' dans index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
