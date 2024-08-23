import logo from 'logo.svg';
import 'App.css';
import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Login from 'components/Login.js';
import Main from 'components/Main.js';


function App() {
  return(
    <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/main" element={<Main />}/>
      </Routes>
    </Router>
  )
}

export default App;
