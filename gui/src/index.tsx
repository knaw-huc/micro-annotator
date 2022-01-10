import './index.css';
import AppContextProvider from './AppContextProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <AppContextProvider/>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
