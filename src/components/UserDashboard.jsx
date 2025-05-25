import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [enfermedades, setEnfermedades] = useState([]);
  const [modalidad, setModalidad] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tratamientos, setTratamientos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
    }
  }, []);

  useEffect(() => {
    const fetchTratamientos = async () => {
      if (usuario?.id) {
        try {
          const res = await axios.get(`https://back-clinica-general.vercel.app/api/tratamientos/${usuario.id}`);
          setTratamientos(res.data);
        } catch (error) {
          console.error('Error al obtener tratamientos:', error);
        }
      }
    };

    fetchTratamientos();
  }, [usuario]);

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    try {
      await axios.post('https://back-clinica-general.vercel.app/api/citas', {
        usuarioId: usuario.id,
        enfermedades,
        tipoCita: modalidad,
      });

      setMensaje('¡Cita agendada correctamente!');
      setEnfermedades([]);
      setModalidad('');
    } catch (error) {
      console.error('Error al agendar cita:', error);
      setMensaje('Error al agendar la cita. Intenta nuevamente.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Bienvenido al Panel del Paciente</h2>

      {usuario && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Documento:</strong> {usuario.documento}</p>
          <p><strong>Edad:</strong> {calcularEdad(usuario.fechaNacimiento)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Selecciona la(s) enfermedad(es) que padeces:</h3>
        <div>
          {[
            { label: 'Diabetes', value: 'diabetes' },
            { label: 'Cáncer', value: 'cancer' },
            { label: 'Insuficiencia cardíaca', value: 'insuficiencia_cardiaca' },
            { label: 'Otra(s)', value: 'otras' }
          ].map((enf) => (
            <label key={enf.value} style={{ display: 'block', marginBottom: '4px' }}>
              <input
                type="checkbox"
                value={enf.value}
                checked={enfermedades.includes(enf.value)}
                onChange={(e) => {
                  const selected = [...enfermedades];
                  if (e.target.checked) {
                    selected.push(enf.value);
                  } else {
                    const index = selected.indexOf(enf.value);
                    if (index > -1) selected.splice(index, 1);
                  }
                  setEnfermedades(selected);
                }}
              />
              {` ${enf.label}`}
            </label>
          ))}
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>
            Modalidad de la cita:
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              required
              style={{ display: 'block', marginTop: '5px' }}
            >
              <option value="">-- Selecciona una opción --</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
            </select>
          </label>
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>
          Agendar cita
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '15px', color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}

      <h3 style={{ marginTop: '40px' }}>Tratamientos Recibidos</h3>
      {tratamientos.length === 0 ? (
        <p>No has recibido tratamientos aún.</p>
      ) : (
        <ul>
          {tratamientos.map((cita) => (
            <li key={cita._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <p><strong>Enfermedades:</strong> {cita.enfermedades.join(', ')}</p>
              <p><strong>Modalidad:</strong> {cita.tipoCita}</p>
              <p><strong>Médico:</strong> {cita.medico?.nombre || 'Desconocido'}</p>
              <p><strong>Tratamiento:</strong> {cita.tratamiento}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleLogout} style={{ marginTop: '30px' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserDashboard;
