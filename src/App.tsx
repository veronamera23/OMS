import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Write from "./components/Write";
import Register from './components/register'; 
import Login from './components/login'; 
import Navbar from './components/Navbar'; 

export default function Example() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Shaina Marie</p>
          <Routes>
            <Route path="/" element={<Write />} />
            <Route path="/write" element={<Write />} />
          </Routes>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Router>
  );
}
