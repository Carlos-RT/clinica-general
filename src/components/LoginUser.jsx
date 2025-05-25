// src/components/LoginUser.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginUser() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://back-clinica-general.vercel.app/api/login', {
        correo,
        contraseña
      });

      const { token } = response.data;

      // Decodificar el token para obtener el rol
      const payload = JSON.parse(atob(token.split('.')[1])); // no usar en producción, usar jwt-decode
      const rol = payload.rol;

      // Guardar token en localStorage
      localStorage.setItem('token', token);

      // Redirigir por rol
      if (rol === 'paciente') navigate('/dashboard/user');
      else if (rol === 'medico') navigate('/dashboard/worker');
      else if (rol === 'administrador') navigate('/dashboard/admin');
      else navigate('/');

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}

export default LoginUser;
