import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider defaultSetOptions={{ sameSite: 'strict' }}>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
