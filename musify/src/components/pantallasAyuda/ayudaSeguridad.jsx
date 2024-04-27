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
                <Desplegable title=''>
                        <p></p>
                </Desplegable>
                <Desplegable title=''>
                        <p></p>
                </Desplegable>
                <Desplegable title=''>
                        <p></p>
                </Desplegable>
                <Desplegable title=''>
                        <p></p>
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