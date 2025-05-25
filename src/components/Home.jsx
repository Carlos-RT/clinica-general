import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [mostrarOpcionesRegistro, setMostrarOpcionesRegistro] = useState(false);
  const navigate = useNavigate();
  
  const irALogin = () => {
    navigate('/login');
  };

  const handleRegister = (role) => {
    navigate(`/registrarse/${role}`);
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Clínica General</h1>

       <button onClick={irALogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Iniciar sesión
      </button>

      {/* Línea divisoria */}
      <div style={styles.divider} />

      <div style={styles.registerPrompt}>
        <span>¿No tienes cuenta? </span>
        <button
          onClick={() => setMostrarOpcionesRegistro(!mostrarOpcionesRegistro)}
          style={styles.registerToggle}
        >
          Regístrate
        </button>
      </div>

      {mostrarOpcionesRegistro && (
        <div style={styles.registerOptions}>
          <button
            onClick={() => handleRegister('paciente')}
            style={{ ...styles.registerButton, backgroundColor: '#38a169' }} // verde
          >
            Registrarse como Paciente
          </button>
          <button
            onClick={() => handleRegister('medico')}
            style={{ ...styles.registerButton, backgroundColor: '#3182ce' }} // azul
          >
            Registrarse como Médico
          </button>
          <button
            onClick={() => handleRegister('administrador')}
            style={{ ...styles.registerButton, backgroundColor: '#805ad5' }} // morado
          >
            Registrarse como Administrador
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7fafc', // fondo claro
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2b6cb0', // azul oscuro
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#2b6cb0',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginBottom: 40,
  },
  divider: {
    width: '80%',
    maxWidth: 300,
    height: 1,
    backgroundColor: '#cbd5e0', // gris claro
    marginBottom: 25,
  },
  registerPrompt: {
    fontSize: '0.9rem',
    color: '#4a5568', // gris oscuro
    marginBottom: 15,
  },
  registerToggle: {
    backgroundColor: 'transparent',
    color: '#2b6cb0',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  registerOptions: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  registerButton: {
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Home;