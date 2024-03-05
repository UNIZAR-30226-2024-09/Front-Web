import React from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import "./LoginForm.css"
import "./scrollbar.css"

export default function RegisterInfo() {
    return (
        <>
        <Logo src="/imagenes/logo-musify.png" alt="Logo de Musify" />
         <Container>
        <div className='wrapper'>
            <form action="">
                <h1>Cuéntanos sobre ti</h1>
                <div className="input-box">
                    <input type="text" placeholder="Nombre" required />
                    <FaUser className="icon"/>
                </div>
                <div className="input-box">
                    <input type="text" placeholder="Fecha de nacimiento" required />
                    <MdCalendarMonth className="icon"/>
                </div>
                <div className="text-right mt-4">
                    <p style={{ color: 'white', marginBottom: '10px' }}>Género</p>
                </div>
                <p><input type="radio" name="sexo" value="h" /> Hombre <input type="radio" name="sexo" value="m" /> Mujer <input type="radio" name="sexo" value="o" /> Otro <input type="radio" name="sexo" value="p" /> Prefiero no decirlo</p>
                <button type="submit">Siguiente</button>
            </form>
        </div>
    </Container>
    </>
    );
}

const Logo = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    height: 200px;
    margin-left: 15px;
    margin-top: 0px;
`;

const Container = styled.div`
.wrapper {
    width: 800px;
    height: 550px;
    color: #fff;
    border-radius: 40px;
    padding: 30px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    background: rgba(0, 0, 0, 0.25);
}
.wrapper h1{
    font-size: 36px;
    text-align: center;
    margin-top: 20px;
}

.wrapper .input-box {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 50px;
    margin: 30px auto;
    margin-top: 50px;
}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    border: 2px solid rgba(255,255,255, .2);
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    padding: 20px 45px 20px 20px;
    border: 2px solid #fff;

}

.input-box input::placeholder {
    color: #fff;
}

.input-box .icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
}

.wrapper button {
    width: 100%;
    background: #54b2e7;
    color: #fff;
    width: 100%;
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