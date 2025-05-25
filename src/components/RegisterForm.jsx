import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const { rol } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    fechaNacimiento: '',
    correo: '',
    sexo: '',
    contraseña: '',
    confirmarContraseña: '',
  });

  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        documento: formData.documento,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        correo: formData.correo,
        sexo: formData.sexo,
        contraseña: formData.contraseña,
        rol: rol,
      };

      await axios.post('https://back-clinica-general.vercel.app/api/registrar', payload);
      setRegistroExitoso(true);
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar el usuario');
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {registroExitoso ? (
        <div style={styles.successBox}>
          <h2 style={styles.successMessage}>¡Registro Exitoso!</h2>
          <button onClick={handleVolver} style={styles.backButton}>Ir a inicio</button>
        </div>
      ) : (
        <>
          <h2 style={styles.title}>Registro como {rol}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre completo" required style={styles.input} />
            <input name="documento" value={formData.documento} onChange={handleChange} placeholder="Documento de identidad" required style={styles.input} />
            <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Número telefónico" required style={styles.input} />
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required style={styles.input} />
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo electrónico" required style={styles.input} />
            <select name="sexo" value={formData.sexo} onChange={handleChange} required style={styles.input}>
              <option value="">Sexo</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
            <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Contraseña" required style={styles.input} />
            <input type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} placeholder="Confirmar contraseña" required style={styles.input} />
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            <button type="submit" style={styles.submit}>Registrarse</button>
          </form>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: '2rem',
    marginBottom: 20,
    color: '#2b6cb0',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: 6,
    border: '1px solid #cbd5e0',
  },
  submit: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    padding: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginTop: 10,
  },
  successBox: {
    textAlign: 'center',
    border: '1px solid #c6f6d5',
    backgroundColor: '#f0fff4',
    padding: 30,
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  successMessage: {
    color: 'green',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 6,
    fontSize: '1rem',
    cursor: 'pointer',
  }
};

export default RegisterForm;
