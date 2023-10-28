import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <CookiesProvider defaultSetOptions={{ sameSite: 'strict' }}>
          <App />
        </CookiesProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)