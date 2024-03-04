import React from 'react';
import { Navbar, Image, Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
//import './inicio_sesion.css'; // Si necesitas estilos adicionales que no están cubiertos por Bootstrap;
import LoginForm from '../../components/LoginForm';

function InicioSesion() {
    document.body.style.backgroundColor = "rgb(28,28,30)";

    const handleInicioSesion = () => {
        // Aquí puedes manejar la lógica para iniciar sesión
        console.log("Iniciando sesión...");
    };
    
    return (
        <>
            <Navbar bg="black" variant="black" style={{ width: '1800px', height: '100px', margin: '0 auto' }}>
                <Navbar.Brand>
                    <Image src="/imagenes/logo-musify.png" style={{ marginRight: '10px', marginTop: '10px', width: '150px', height: '100%' }} />
                </Navbar.Brand>
            </Navbar>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
                <LoginForm  style={{ width: '600px', height: '100px', margin: '0 auto' }}>
                </LoginForm>
            </div>
        </>
    );  
}

export default InicioSesion;
