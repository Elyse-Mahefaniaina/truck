import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/login/Login';
import TripConfiguration from './pages/trip-configuration/TripConfiguration';
import Log from './components/log/Log';

import './App.scss';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to={"/login"}/>} />
            <Route path="/trip" element={<TripConfiguration />} />
            <Route path="/log" element={<Log />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
