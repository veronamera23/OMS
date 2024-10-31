import React from 'react';
import ReactDOM from 'react-dom/client';
import Example from './components/Example';
import reportWebVitals from './reportWebVitals';
import './index.css';
import Navbar from './components/Navbar';
import App from './App'; 
import Register from './components/register';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Navbar />
    <Example />
    <Register/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export{};