// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [citasSeleccionadas, setCitasSeleccionadas] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCitas, resMedicos] = await Promise.all([
          axios.get('https://back-clinica-general.vercel.app/api/todaslascitas'),
          axios.get('https://back-clinica-general.vercel.app/api/medicos')
        ]);
        setCitas(resCitas.data);
        setMedicos(resMedicos.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleAsignar = async () => {
    if (!medicoSeleccionado || citasSeleccionadas.length === 0) {
      setMensaje('Selecciona al menos una cita y un médico.');
      return;
    }

    try {
      await axios.post('https://back-clinica-general.vercel.app/api/asignar-medico', {
        citaIds: citasSeleccionadas,
        medicoId: medicoSeleccionado
      });

      const citasActualizadas = citas.map(cita => {
        if (citasSeleccionadas.includes(cita._id)) {
          const medicoInfo = medicos.find(m => m._id === medicoSeleccionado);
          return { ...cita, medico: medicoInfo };
        }
        return cita;
      });

      setCitas(citasActualizadas);
      setMensaje('Citas asignadas correctamente.');
      setCitasSeleccionadas([]);
      setMedicoSeleccionado('');
    } catch (error) {
      console.error('Error al asignar citas:', error);
      setMensaje('Error al asignar citas.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const citasNoAsignadas = citas.filter(cita => !cita.medico);
  const citasAsignadas = citas.filter(cita => cita.medico);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel del Administrador</h1>

      <div style={{ marginTop: '30px' }}>
        <h2>Citas Agendadas (Sin Asignar)</h2>
        {citasNoAsignadas.map(cita => (
          <label key={cita._id} style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={citasSeleccionadas.includes(cita._id)}
              onChange={() => {
                setCitasSeleccionadas(prev =>
                  prev.includes(cita._id)
                    ? prev.filter(id => id !== cita._id)
                    : [...prev, cita._id]
                );
              }}
            />
            {` ${cita.paciente?.nombre || 'Paciente'} - ${cita.tipoCita}`}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Seleccionar Médico</h2>
        <select
          value={medicoSeleccionado}
          onChange={e => setMedicoSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un médico --</option>
          {medicos.map(medico => (
            <option key={medico._id} value={medico._id}>
              {medico.nombre}
            </option>
          ))}
        </select>

        <button onClick={handleAsignar} style={{ marginLeft: '10px' }}>
          Asignar
        </button>
      </div>

      {mensaje && (
        <p style={{ marginTop: '15px', color: mensaje.includes('Error') ? 'red' : 'green' }}>
          {mensaje}
        </p>
      )}

      <div style={{ marginTop: '40px' }}>
        <h2>Historial de Citas Asignadas</h2>
        {citasAsignadas.length === 0 ? (
          <p>No hay citas asignadas aún.</p>
        ) : (
          <ul>
            {citasAsignadas.map(cita => (
              <li key={cita._id}>
                {`${cita.paciente?.nombre || 'Paciente'} - ${cita.tipoCita} (Asignado a: ${cita.medico?.nombre || 'Médico desconocido'})`}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleLogout} style={{ marginTop: '30px' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default AdminDashboard;
