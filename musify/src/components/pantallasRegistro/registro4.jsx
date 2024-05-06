import React, { useState } from "react";
import styled from "styled-components";
import "../pantallaInicioSesion/inicioSesion.css"
import { useNavigate } from 'react-router-dom';

export default function RegisterTerminosCondiciones() {
    const navigate = useNavigate();
    const [opcion1, setOpcion1] = useState(false);
    const [opcion2, setOpcion2] = useState(false);

    const handleClick = () => {
        navigate('/register_5');
    };

    return (
        <>
            <Logo src="/imagenes/logo-musify.png" alt="Logo de Musify" />
            <Container>
                <div className='wrapper'>
                    <h1>Terminos y condiciones</h1>
                    <label className="option-container">
                        <input
                            type="checkbox"
                            checked={opcion1}
                            onChange={() => setOpcion1(!opcion1)}
                        />
                        Quiero que me enviéis novedades y ofertas de Musify
                    </label>
                    <label className="option-container">
                        <input
                            type="checkbox"
                            checked={opcion2}
                            onChange={() => setOpcion2(!opcion2)}
                        />
                        Compartir mis datos de registro con los proveedores de contenidos 
                        de Musify para fines de marketing. Ten en cuenta que tus datos pueden 
                        ser transferidos a un país de fuera del EEE, tal y como se recoge 
                        en nuestra Política de Privacidad.
                    </label>
                    <div className="disclaimer">
                        Al hacer clic en Siguiente, aceptas los Términos y condiciones de uso de Musify.
                        <br />
                        <br />
                        Para obtener más información acerca de cómo Musify recopila, utiliza, comparte y 
                        protege tus datos personales, consulta la Política de privacidad de Musify.
                    </div>
                    <button type="button" onClick={handleClick}>Siguiente</button>
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

.date-input-box {
    position: relative;
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

.option-container {
    width: 100%;
    height: auto;
    display: inline-block;
    background-color: none;
    border: 3px solid #fff;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 30px;
}

.disclaimer {
    text-align: justify;
    font-size: 13px;
    color: #fff;
    margin-top: 10px; 
}

`;