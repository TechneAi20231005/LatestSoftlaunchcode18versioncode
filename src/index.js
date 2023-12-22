import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './assetsNew/css/my-task.style.min.css';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');

const renderApp = () => {
  createRoot(root).render(
    <BrowserRouter forceRefresh={true}>
      <App />
    </BrowserRouter>
  );
};

// Start rendering the app
renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
