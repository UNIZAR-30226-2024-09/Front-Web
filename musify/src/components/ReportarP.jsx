import React, { useState, useEffect } from 'react';
import styled from "styled-components";

export default function ReportarP() {
  const [user, setUser] = useState({});
  const [tipoProblema, setTipoProblema] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/obtenerUsuarioSesionAPI/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error('Failed to fetch user details:', data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, []);

  const handleTipoProblemaChange = (e) => {
    setTipoProblema(e.target.value);
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  const enviarReporte = async () => {
    if (!user.correo) {
      alert("Usuario no identificado. Asegúrese de haber iniciado sesión.");
      return;
    }
    const url = 'http://localhost:8000/reporteAPI/';
    const body = {
      correo: user.correo,
      mensaje: `Tipo de problema: ${tipoProblema}, Descripción: ${descripcion}`
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      alert(data.message); // "Reporte enviado con éxito"
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      alert('Error al enviar el reporte.');
    }
  };

  return (
    <Container>
      <div className='wrapper'>
        <Header>
          <h1>Reportar Problema</h1>
        </Header>
        <h2>Tipo de problema</h2>
        <div className="select-wrapper" style={{ width: '800px' }}>
          <select className='select' value={tipoProblema} onChange={handleTipoProblemaChange}>
            <option value="">Selecciona una opción</option>
            <option value="problema1">Problemas con la cuenta</option>
            <option value="problema2">Problemas con la aplicación</option>
          </select>
        </div>
        <h2>Descripción del problema</h2>
        <div className='input-box'>
          <textarea className='input' value={descripcion} onChange={handleDescripcionChange}/>
        </div>
        <button type="button" onClick={enviarReporte}>Enviar</button>
      </div>
    </Container>
  );
}

const Container = styled.div` 
.wrapper {
    width: 800px;
    height: 100%;
    padding: 10px;
    color: #fff;
}

.select {
    background: #54b2e7;
    color: #fff;
    padding: 8px;
    width: 100%;
    height: 50px;
    display: flex;
    font-weight: bold;
    font-size: large;
    border-radius: 8px;
    border: 4px solid transparent;
    transition: all 300ms;
    outline: none;
    margin-top: 10px;
    margin-bottom: 10px;
}

.input-box {
    background: #54b2e7;
    color: #fff;
    padding: 8px;
    width: 800px;
    height: 200px;
    border-radius: 8px;
    border: 4px solid transparent;
    margin-top: 10px;
}

.input {
    width: 100%;
    height: 100%;
    color: #fff;
    background: transparent;
    border: none;
    resize: none;
    overflowY: auto;
    outline: none;
}

.wrapper button {
    float: right;
    background: #54b2e7;
    color: #fff;
    width: 200px;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    margin: 10px 0;
}

`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1150px;
    margin-bottom: 30px;

    h1 {
        font-size: 2.5rem;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;
