import logo from 'logo.svg';
import 'App.css';
import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import Login from 'components/Login.js';
import Main from 'components/Main.js';
import Unauthorized from 'components/Unauthorized';


function App() {
  return(
    <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/main" element={
            <AuthRoute>
              <Main />
            </AuthRoute>
          }/>
          <Route path="/401" element={<Unauthorized />} />
      </Routes>
    </Router>
  )
}

function AuthRoute({ children }) {
  const token = localStorage.getItem('token');
    
  return token ? children : <Navigate to="/" />;
}

export default App;
