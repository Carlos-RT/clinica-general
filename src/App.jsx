import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import Home from './components/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginUser from './components/LoginUser'; // Asegúrate de que la ruta sea correcta
import UserDashboard from './components/UserDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse/:rol" element={<RegisterForm />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/worker" element={<WorkerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}


export default App
