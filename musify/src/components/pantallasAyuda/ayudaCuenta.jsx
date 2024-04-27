import React from 'react'
import styled from "styled-components";
import Desplegable from '../desplegable'

export default function Ayuda() {
  return (
        <Container>
                <div className='wrapper'>
                <Header>
                        <h1>Ayuda con la cuenta</h1>
                </Header>
                <Desplegable title='¿Problemas al iniciar sesión?'>
                        <p>Si tienes problemas para iniciar sesión, asegúrate de utilizar las credenciales correctas. También puedes intentar restablecer tu contraseña si la has olvidado.</p>
                </Desplegable>
                <Desplegable title='¿Cómo cambiar la foto de perfil?'>
                        <p>Para cambiar tu imagen de perfil, ve a la configuración de tu cuenta y selecciona la opción para editar tu perfil. Desde allí, podrás subir una nueva imagen.</p>
                </Desplegable>
                <Desplegable title='¿Se puede cambiar el nombre de usuario?'>
                        <p>Puedes cambiar tu nombre de usuario en la configuración de tu cuenta. Simplemente haz clic en la opción para editar tu perfil y sigue las instrucciones para cambiar tu nombre de usuario.</p>
                </Desplegable>
                <Desplegable title='¿Es posible cambiar el correo asociado a la cuenta?'>
                        <p> No es posible cambiar el correo asociado a la cuenta. Si necesitas cambiar tu correo electrónico, deberás crear una nueva cuenta con la dirección de correo electrónico deseada.</p>
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