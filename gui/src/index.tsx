import './index.css';
import AppRouter from './AppRouter';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <AppRouter/>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
