// main.jsx — The entry point of our React application
// This file mounts the React app into the HTML page

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import './index.css';

// Create a root and render our app
// BrowserRouter enables page navigation
// AuthProvider makes login/user data available everywhere
// TransactionProvider makes transaction data available everywhere
// Toaster shows popup notifications (success, error messages)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              // Style toast notifications to match our dark theme
              style: {
                background: '#252547',
                color: '#ffffff',
                border: '1px solid #2a2a4a',
              },
              // Green checkmark for success
              success: {
                iconTheme: { primary: '#00c853', secondary: '#ffffff' },
              },
              // Red X for errors
              error: {
                iconTheme: { primary: '#ff5252', secondary: '#ffffff' },
              },
            }}
          />
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
