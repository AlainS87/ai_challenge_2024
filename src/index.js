import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import CSS file for styling
import App from './App'; // Import App component
import reportWebVitals from './reportWebVitals'; // Import reportWebVitals for performance measurement

// Render the App component into the root element of the DOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Mount point in HTML
);

// Measure web vitals for performance monitoring
reportWebVitals();