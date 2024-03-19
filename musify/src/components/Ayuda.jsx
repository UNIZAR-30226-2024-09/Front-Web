import React from 'react'
import styled from "styled-components";
import Desplegable from './desplegable'

export default function Ayuda() {
  return (
        <Container>
                <div className='wrapper'>
                <Header>
                        <h1>Ayuda con la cuenta</h1>
                </Header>
                <Desplegable title='Inicio de Sesion'>
                        contenido1
                </Desplegable>
                <Desplegable title='Imagen de Perfil'>
                        contenido2
                </Desplegable>
                <Desplegable title='Nombre de Usuario'>
                        contenido3
                </Desplegable>
                <Desplegable title='Cambiar Correo'>
                        contenido4
                </Desplegable>
                <Desplegable title='No me acuerdo de mis datos de inicio de sesion'>
                        contenido5
                </Desplegable>
                </div>
        </Container>
  )
}

const Container = styled.div` 
.wrapper {
        width: 800px;
        height: 100%;
        padding: 10px;
        color: #fff;
}

.h1{
        font-size: 36px;
        text-align: left;
        margin-top: 20px;
        font-size: 2.5rem;
        color: #ffffff;
}
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1150px;
    margin-bottom: 50px;

    h1 {
        font-size: 2.5rem;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;