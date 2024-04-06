import React from 'react';
import styled from 'styled-components';
import imagenPerfil from './panda.jpg';

const IconoPerfil = () => {
  return <ImagenPerfil src={imagenPerfil} alt="Perfil" />;
};

export default IconoPerfil;

const ImagenPerfil = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
`;
