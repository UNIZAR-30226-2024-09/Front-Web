import React from 'react'
import styled from "styled-components";
import Desplegable from '../desplegable'

export default function Ayuda() {
        return (
          <Container>
            <div className='wrapper'>
              <Header>
                <h1>Seguridad y privacidad</h1>
              </Header>
              <Desplegable title='Privacidad de datos'>
                <p>
                  En nuestra aplicación, tratamos de proteger tu información personal. Utilizamos medidas básicas de seguridad y estamos comprometidos en mejorar continuamente. Apreciamos tus sugerencias y paciencia mientras trabajamos en hacer la aplicación más segura.
                </p>
              </Desplegable>
              <Desplegable title='Seguridad de la cuenta'>
                <p>
                  Te recomendamos usar una contraseña segura y cambiarla regularmente. Aunque estamos trabajando en implementar autenticación de dos factores, aún no está disponible. Por favor, no compartas tu contraseña con nadie.
                </p>
              </Desplegable>
              <Desplegable title='Términos de servicio'>
                <p>
                  Al usar esta aplicación, aceptas nuestros términos de servicio. Estos términos explican cómo debes utilizar la aplicación y cuáles son tus responsabilidades como usuario. Por favor, léelos cuidadosamente para evitar malentendidos.
                </p>
              </Desplegable>
              <Desplegable title='Preguntas frecuentes'>
                <p>
                  ¿Tienes preguntas? Aquí respondemos a las consultas más comunes sobre el uso de nuestra aplicación. Desde cómo registrarte hasta cómo resolver problemas técnicos, esta sección está diseñada para ayudarte a sacar el máximo provecho de nuestra plataforma.
                </p>
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