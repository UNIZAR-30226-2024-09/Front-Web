import React from 'react'
import styled from "styled-components";

export default function ReportarP() {
  return (
    <Container>
        <div className='wrapper'>
            <Header>
                <h1>Reportar Problema</h1>
            </Header>
            <h2>Tipo de problema</h2>
            <div className="select-wrapper" style={{ width: '800px' }}>
                <select className='select'>
                    <option value ="">Selecciona una opción</option>
                    <option value ="problema1">Problemas con la cuenta</option>
                    <option value ="problema2">Problemas con la aplicación</option>
                </select>
            </div>
            <h2>Descripción del problema</h2>
            <div className='input-box'>
                <textarea className='input'/>
            </div>
            <button type="button">Enviar</button>
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

.select {
    background: #54b2e7;
    color: #fff;
    padding: 8px;
    width: 100%;
    height: 50px;
    display: flex;
    font-weight: bold;
    font-size: large;
    border-radius: 8px;
    border: 4px solid transparent;
    transition: all 300ms;
    outline: none;
    margin-top: 10px;
    margin-bottom: 10px;
}

.input-box {
    background: #54b2e7;
    color: #fff;
    padding: 8px;
    width: 800px;
    height: 200px;
    border-radius: 8px;
    border: 4px solid transparent;
    margin-top: 10px;
}

.input {
    width: 100%;
    height: 100%;
    color: #fff;
    background: transparent;
    border: none;
    resize: none;
    overflowY: auto;
    outline: none;
}

.wrapper button {
    float: right;
    background: #54b2e7;
    color: #fff;
    width: 200px;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    margin: 10px 0;
}

`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1150px;
    margin-bottom: 30px;

    h1 {
        font-size: 2.5rem;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;
