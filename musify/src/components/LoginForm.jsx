import React from "react";
import styled from "styled-components";
import { FaUser, FaLock} from "react-icons/fa";
import "./LoginForm.css"

export default function LoginForm() {
    return <Container>
        <div className='wrapper'>
            <form action="">
                <h1>Inicie Sesión en Musify</h1>
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
                <div className="register-link">
                    <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                </div>
            </form>
        </div>
    </Container>
}

const Container = styled.div`
.wrapper{
    width: 420px;
    background: #000000;
    color: #fff;
    border-radius: 10px;
    padding: 30px 40px;
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
    border-radius: 40px;
    font-size: 16px;
    color: #fff;
    padding: 20px 45px 20px 20px;
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

.wrapper button {
    width: 100%;
    height: 45px;
    background: #fff;
    border: none;
    outline: none;
    border-radius: 40px;
    box-shadow: 0 0 10px rgba(0,0,0, .1);
    cursor: pointer;
    font-size: 16px;
    color: #333;
    font-weight: 700;
}

.wrapper .register-link {
    font-size: 14.5 px;
    text-align: center;
    margin: 20px 0 15px;
}

.register-link p a:hover {
    text-decoration: underline;
}
`;