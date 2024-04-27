import React from 'react';
import styled from 'styled-components';

const LyricsWindow = ({ lyrics, currentTime, onClose }) => {
  if (!Array.isArray(lyrics)) {
    console.error('Expected lyrics to be an array but received:', lyrics);
    return <div>No lyrics available</div>;
  }

  // Filtra la línea actual de las letras basada en el tiempo actual
  const currentLine = lyrics.find(line => currentTime >= line.time && (!lyrics[lyrics.indexOf(line) + 1] || currentTime < lyrics[lyrics.indexOf(line) + 1].time));

  return (
      <Backdrop onClick={onClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={onClose}>&times;</CloseButton>
              {currentLine ? <p style={{ color: 'white' }}>{currentLine.text}</p> : <p style={{ color: 'white' }}>No lyrics to display</p>}
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
