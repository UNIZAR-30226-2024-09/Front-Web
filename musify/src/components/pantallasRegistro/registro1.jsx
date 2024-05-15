import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext/userContext';

export default function RegisterMail() {
  const { setUserDetails } = useUser(); // Obtiene userDetails y setUserDetails del contexto del usuario
  const navigate = useNavigate();
  const [correo, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    // Aquí, verifica si el campo de correo electrónico está lleno
    setEmailValid(correo.trim() !== '');
  }, [correo]);

  const handleGoogleSignIn = () => {
    console.log("Inicio de sesión con Google");
    };


  const handleClick = () => {
    if (emailValid) {
      // Actualiza los detalles del usuario en el contexto
      setUserDetails(prevDetails => ({ ...prevDetails, correo }));
      navigate('/register_2');
    }
  };

  return (
    <>
      <Logo src="/imagenes/logo-musify.png" alt="Logo de Musify" />
      <Container>
        <div className='wrapper'>
          <form action="">
            <h1>Regístrate ahora</h1>
            <div className="input-box">
              <input 
                type="text" 
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Dirección de correo electrónico" required />
              <FaUser className="icon"/>
            </div>
            <button type="button" onClick={handleClick} disabled={!emailValid}>Siguiente</button>
          </form>
        </div>
      </Container>
    </>
  );
}

const Logo = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    height: 200px;
    margin-left: 15px;
    margin-top: 0px;
`;

const Container = styled.div`
.wrapper {
  width: 650px;
  height: 460px;
  color: #fff;
  border-radius: 40px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  background: rgba(0, 0, 0, 0.25);
}

.wrapper h1 {
  font-size: 36px;
  text-align: center;
  margin-top: 50px;
}

.wrapper .input-box {
  position: relative;
  width: 800px;
  max-width: 400px;
  height: 50px;
  margin-top: 50px; 
}

.input-box input {
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  border-radius: 20px;
  font-size: 16px;
  color: #fff;
  padding: 20px 45px 20px 20px;
  border: 2px solid #fff;
}

.input-box input::placeholder {
    color: #fff;
}

.input-box .icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.wrapper button {
  width: 100%;
  max-width: 400px;
  height: 50px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  background: #54b2e7;
  color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0, .1);
  margin-top: 20px; // Añadido para mejorar el espaciado y la alineación
}
`;