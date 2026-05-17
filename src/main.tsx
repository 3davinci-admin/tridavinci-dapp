import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';

// TonConnectUIProvider оборачивает всё приложение —
// благодаря этому кнопка Tonkeeper доступна на любой странице
ReactDOM.createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl="http://localhost:5173/tonconnect-manifest.json">
        <App />
    </TonConnectUIProvider>
);
