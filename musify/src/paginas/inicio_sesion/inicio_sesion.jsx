import React from 'react';
import { Navbar, Image, Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import './inicio_sesion.css'; // Si necesitas estilos adicionales que no están cubiertos por Bootstrap
import logo from '../../imagenes/logo-musify.png';

function InicioSesion() {
    document.body.style.backgroundColor = "rgb(28,28,30)";

    const handleInicioSesion = () => {
        // Aquí puedes manejar la lógica para iniciar sesión
        console.log("Iniciando sesión...");
    };
    
    return (
        <>
            <Navbar bg="black" variant="black" style={{ width: '1600px', height: '100px', margin: '0 auto' }}>
                <Navbar.Brand>
                    <Image src={logo} alt="Logo" style={{ marginRight: '10px', marginTop: '10px', width: '150px', height: '100%' }} />
                </Navbar.Brand>
            </Navbar>
            <div className="login-card">
            <h1 style={{ fontWeight: 'bold' }}>Inicie Sesión en Musify</h1>
                <div className="text-center mt-4">
                <Button variant="dark" className="btn-lg rounded-pill custom-button" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    <FaGoogle className="google-icon" />
                        Continuar con Google
                </Button>
                </div>
                <hr className="linea-blanca" />
                <div className="text-center mt-4">
                    <p style={{ color: 'white', marginBottom: '10px' }}>Correo electrónico o nombre de usuario</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <input type="text" className="form-control" placeholder="Introduce tu correo electrónico o nombre de usuario" style={{ width: '300px', height: '40px', borderRadius: '5px', border: '2px solid white', backgroundColor: 'transparent', color: 'white', padding: '5px 10px', marginBottom: '20px' }} />
                    </div>
                </div>
                <div className="text-center">
                    <p style={{ color: 'white', marginBottom: '10px' }}>Contraseña</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <input type="password" className="form-control" placeholder="Introduce tu contraseña" style={{ width: '300px', height: '40px', borderRadius: '5px', border: '2px solid white', backgroundColor: 'transparent', color: 'white', padding: '5px 10px', marginBottom: '20px' }} />
                    </div>
                </div>
                <div className="text-center mt-4">
                    <Button variant="info" className="btn-lg" style={{ backgroundColor: '#54b2e7', border: 'none', color: 'white' }} onClick={handleInicioSesion}>
                        Inicie Sesión
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p style={{ color: 'white', marginBottom: '10px' }}>¿No tienes cuenta? <a href="/registro_correo" style={{ color: '#54b2e7' }}>Suscríbete a Musify</a></p>
                </div>
                {/* Otro contenido que desees incluir en la tarjeta */}
            </div>
        </>
    );  
}

export default InicioSesion;
