import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';

// // static import
import App from './App';
import { PreLoadingProvider } from './context';
import { store } from './redux/store/store';
import reportWebVitals from './reportWebVitals';
import './assetsNew/css/my-task.style.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <PreLoadingProvider>
          <App />
        </PreLoadingProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="colored"
          icon={true}
        />
      </BrowserRouter>
    </Provider>
  );
};

// Start rendering the app
renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
