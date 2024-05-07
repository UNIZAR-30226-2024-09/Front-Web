import React from 'react';
import styled from 'styled-components';

const AniadirWindow = ({ onClose, ruta }) => {
  return (
      <Backdrop onClick={onClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
          <h5>¿Está seguro de que quiere salir sin gurdar la información?</h5>
            <ButtonContainer>
                <NoButton onClick={onClose}>No</NoButton>
                <SiButton onClick={ruta}>Sí</SiButton>
            </ButtonContainer>
          </ModalContent>
      </Backdrop>
  );
};
export default AniadirWindow;



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
  max-height: 700px;
  overflow-y: auto;
  position: relative;
  z-index: 101;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Estilo para botones
const NoButton = styled.button`
    padding: 15px 30px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    background-color: #f44336; /* Rojo */
    color: #fff;
`;

const SiButton = styled.button`
    padding: 15px 30px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    background-color: #4CAF50; /* Verde */
    color: #fff;
`;
