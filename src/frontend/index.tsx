import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/frontend/App.tsx';
import reportWebVitals from 'src/reportWebVitals.ts';
import 'src/frontend/styles/tailwind.css';
import 'src/frontend/styles/animations.css';

const main = () => {
  // Get the root element from the HTML document
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Create a React root using ReactDOM.createRoot
  const root = ReactDOM.createRoot(rootElement);

  // Render the App component within React.StrictMode
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Call reportWebVitals to measure performance metrics
  reportWebVitals(console.log);
};

main();