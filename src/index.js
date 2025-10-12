import React from 'react';
import ReactDOM from 'react-dom/client';
import './indexx.css';  // If you have any global styles
import App from './App';  // Import the App component


const root= ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Render the App component which includes Home */}
  </React.StrictMode>,
);
