// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from "@mui/material/CssBaseline"; // REMOVED - This breaks Tailwind styles
import { AppProvider } from './contexts/AppProvider';
import theme from './theme/theme';
import App from './App';
import './index.css'; // Tailwind CSS

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                {/* <CssBaseline /> Removed - This was breaking Tailwind styles */}
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
