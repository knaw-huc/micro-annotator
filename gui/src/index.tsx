import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import AppContextprovider from './AppContextprovider';

ReactDOM.render(
    <React.StrictMode>
        <AppContextprovider/>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
