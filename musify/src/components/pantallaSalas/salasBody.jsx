import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Salas = () => {
  const [salas, setSalas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreSala, setNombreSala] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  const handleJoinRoom = (salaId, salaNombre) => {
    navigate(`/chat/${salaId}`, { state: { nombreSala: salaNombre } });
  };

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await fetch('http://musify.servemp3.com:8000/listarSalas/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        setSalas(data.salas);
        setCargando(false);
      } catch (error) {
        setError(error.message);
        setCargando(false);
      }
    };

    fetchSalas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://musify.servemp3.com:8000/crearSalaAPI/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': 'tu_token_csrf_aquí'
        },
        body: JSON.stringify({ nombre: nombreSala })
      });
      if (response.ok) {
        const nuevaSala = await response.json();
        setSalas([...salas, { id: salas.length + 1, nombre: nombreSala }]);
        setNombreSala('');
        setMostrarModal(false);
      } else {
        throw new Error('Error al crear la sala');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <SalasContainer>
      <Titulo>Salas</Titulo>
          {salas.map((sala) => (
      <Sala key={sala.id} onClick={() => handleJoinRoom(sala.id, sala.nombre)}>
        <NombreSala>{sala.nombre}</NombreSala>
        <UnirseAhora>Únete ahora</UnirseAhora>
      </Sala>
    ))}
      <CrearSala onClick={() => setMostrarModal(true)}>
        <PlusIcon>+</PlusIcon>
        <CrearSalaTexto>Crear Sala</CrearSalaTexto>
      </CrearSala>
      {mostrarModal && (
        <ModalOverlay>
          <Modal>
            <Formulario onSubmit={handleSubmit}>
              <Input
                type="text"
                value={nombreSala}
                onChange={(e) => setNombreSala(e.target.value)}
                placeholder="Nombre de la sala"
                required
              />
              <BotonCrear type="submit">Guardar</BotonCrear>
              <BotonCerrar onClick={() => setMostrarModal(false)}>Cerrar</BotonCerrar>
            </Formulario>
          </Modal>
        </ModalOverlay>
      )}
    </SalasContainer>
  );
};

export default Salas;

// Estilos
const SalasContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Titulo = styled.h2`
  color: #fff;
  margin-bottom: 20px;
`;

const Sala = styled.div`
  background-color: #2C3E50;
  color: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: #34495E;
  }
`;

const NombreSala = styled.h3`
  margin: 0;
`;

const UnirseAhora = styled.a`
  color: #54b2e7;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  display: block;
  margin-top: 10px;
`;

const CrearSala = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #34495E;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
`;

const PlusIcon = styled.span`
  font-size: 24px;
  margin-bottom: 5px;
`;

const CrearSalaTexto = styled.span``;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // Asegúrate de que esto sea mayor que cualquier otro contenido
`;

const Modal = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const BotonCrear = styled.button`
  background-color: #54b2e7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const BotonCerrar = styled.button`
  background-color: #ccc;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;