import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import AppContextProvider from './AppContextProvider';

ReactDOM.render(
    <React.StrictMode>
        <AppContextProvider/>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
