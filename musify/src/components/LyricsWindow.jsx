import React from 'react';
import styled from 'styled-components';

const LyricsWindow = ({ lyrics, onClose }) => {
    // Detiene la propagación del evento de clic para evitar que el modal se cierre al hacer clic en su contenido
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Backdrop onClick={onClose}>
            <ModalContent onClick={handleContentClick}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {lyrics.map((line, index) => (
                    <p key={index} style={{ color: 'white' }}>{line.text}</p>
                ))}
            </ModalContent>
        </Backdrop>
    );
};

export default LyricsWindow;


const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

// Estilos para el contenedor del contenido del modal
const ModalContent = styled.div`
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
  z-index: 101;
`;

// Estilo para el botón de cerrar
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;
