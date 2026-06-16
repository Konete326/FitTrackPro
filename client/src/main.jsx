import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './utils/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#1f2937', color: '#f3f4f6', borderRadius: '0.75rem' },
              success: { iconTheme: { primary: '#3ec972', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ff5656', secondary: '#fff' } },
            }}
          />
          <App />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
