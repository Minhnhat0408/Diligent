import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Globalstyle from './component/Globalstyle';
import { ThemeProvider } from './contexts';
import { AuthContextProvider } from './contexts/authContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <Globalstyle>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </Globalstyle>
        </AuthContextProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
