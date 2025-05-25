import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkerDashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [citasAsignadas, setCitasAsignadas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [tratamiento, setTratamiento] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
    }
  }, []);

  useEffect(() => {
    const obtenerCitasAsignadas = async () => {
      if (usuario?.id) {
        try {
          const res = await axios.get(`https://back-clinica-general.vercel.app/api/asignadas/${usuario.id}`);
          // Solo mostrar las que no han sido atendidas
          setCitasAsignadas(res.data.filter(cita => !cita.atendida));
        } catch (error) {
          console.error('Error al cargar citas asignadas:', error);
        }
      }
    };

    obtenerCitasAsignadas();
  }, [usuario]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEnviarTratamiento = async () => {
    if (!tratamiento.trim()) {
      setMensaje('Debes escribir un tratamiento.');
      return;
    }

    try {
      await axios.post('https://back-clinica-general.vercel.app/api/citas/tratamiento', {
        citaId: citaSeleccionada._id,
        tratamiento,
      });

      setMensaje('Tratamiento enviado al paciente.');
      setCitasAsignadas(prev => prev.filter(c => c._id !== citaSeleccionada._id));
      setCitaSeleccionada(null);
      setTratamiento('');
    } catch (error) {
      console.error('Error al enviar tratamiento:', error);
      setMensaje('Error al enviar tratamiento.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Panel del Médico</h2>

      {usuario && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Documento:</strong> {usuario.documento}</p>
          <p><strong>ID:</strong> {usuario.id}</p>
        </div>
      )}

      <h3>Citas Asignadas</h3>

      {citasAsignadas.length > 0 ? (
        <>
          {!citaSeleccionada ? (
            <div
              onClick={() => setCitaSeleccionada(citasAsignadas[0])}
              style={{
                cursor: 'pointer',
                padding: '10px',
                border: '1px solid gray',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            >
              <p><strong>Paciente:</strong> {citasAsignadas[0].paciente?.nombre}</p>
              <p><strong>Documento:</strong> {citasAsignadas[0].paciente?.documento}</p>
              <p><strong>Enfermedades:</strong> {citasAsignadas[0].enfermedades.join(', ')}</p>
              <p><strong>Tipo de Cita:</strong> {citasAsignadas[0].tipoCita}</p>
            </div>
          ) : (
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
              <h4>Formulario de Tratamiento</h4>
              <textarea
                placeholder="Escribe aquí el tratamiento o medicamentos..."
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                rows={4}
                cols={60}
                style={{ marginBottom: '10px' }}
              />
              <br />
              <button onClick={handleEnviarTratamiento} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
                Enviar tratamiento
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No tienes citas asignadas aún.</p>
      )}

      {mensaje && (
        <p style={{ marginTop: '20px', color: 'green' }}>{mensaje}</p>
      )}

      <button onClick={handleLogout} style={{ marginTop: '30px' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default WorkerDashboard;
