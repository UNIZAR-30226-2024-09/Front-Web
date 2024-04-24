import React from 'react';
import styled from 'styled-components';

const EditCapWindow = ({idCap}) => {
  return (
      <Backdrop>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ButtonContainer>
                <input
                    type="titulo"
                />
                <input
                    type="fecha"
                />
                <input
                    type="duración"
                />
                <input
                    type="descripcion"
                />
                <CloseButton>&times;</CloseButton>
                <AddButton>Guardar</AddButton>
            </ButtonContainer>
          </ModalContent>
      </Backdrop>
  );
};
export default EditCapWindow;



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

const AddButton = styled.button`
    padding: 15px 30px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #fff;
`;
