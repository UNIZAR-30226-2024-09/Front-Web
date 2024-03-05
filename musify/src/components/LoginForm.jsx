import React from "react";
import styled from "styled-components";
import { FaUser, FaLock } from "react-icons/fa";
import "./LoginForm.css"
import { FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
    const handleGoogleSignIn = () => {
        console.log("Inicio de sesión con Google");
    };
    return (
        <>
        <Logo src="/imagenes/logo-musify.png" alt="Logo de Musify" />
         <Container>
        <div className='wrapper'>
            <form action="">
                <h1>Inicie Sesión en Musify</h1>
                <button type="button" onClick={handleGoogleSignIn} className="google-signin-button">
                    <FaGoogle className="google-icon" />
                    Continuar con Google
                </button>
                <div className="separator"></div>

                <div className="input-box">
                    <input type="text" placeholder="Nombre de usuario o correo electrónico" required />
                    <FaUser className="icon"/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Contraseña" required />
                    <FaLock className="icon" />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Recuérdame</label>
                    <a href="#">¿Has olvidado tú contraseña?</a>
                </div>

                <button type="submit">Iniciar Sesion</button>
                <div className="separator"></div>
                <div className="register-link">
                    <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                </div>
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
}

.wrapper .input-box {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 30px 0;
}

.input-box input{
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

.wrapper .remember-forgot {
    display: flex;
    justify-content: space-between;
    font-size: 14.5px;
    margin: -15px 0 15px;
}

.remember-forgot label input {
    accent-color: #fff;
    margin-right: 4px;
}

.remember-forgot a {
    color: #fff;
    text-decoration: none;

}

.remember-forgot a:hover {
    text-decoration: underline;
}

.wrapper button, .wrapper .google-signin-button {
    width: 100%;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    margin: 10px 0;
}

.wrapper button {
    background: #54b2e7;
    color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0, .1);
    border-radius: 20px;
}

.wrapper .google-signin-button {
    background: transparent;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: 2px solid #fff;
    margin-top: 20px;
}

.wrapper .google-signin-button::before 
    display: inline-block;{
    height: 24px;
    width: 24px;
    background-size: cover;
}

.google-icon {
    color: #54b2e7;
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 1px;

}

.wrapper .register-link {
    font-size: 14.5 px;
    text-align: center;
    margin: 20px 0 15px;
}

.register-link p a:hover {
    text-decoration: underline;
}

.separator {
    height: 1px; 
    background-color: #fff;
    width: 100%; 
    margin: 20px auto;
}

`;