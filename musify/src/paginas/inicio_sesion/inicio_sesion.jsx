import React from 'react';
import { Navbar, Image } from 'react-bootstrap';
import logo from '../../imagenes/logo-musify.png';

function InicioSesion() {
    document.body.style.backgroundColor = "rgb(28,28,30)";
    return (
        <Navbar bg="black" variant="black" style={{ width: '1600px', height: '100px', margin: '0 auto' }}>
            <Navbar.Brand>
                <Image src={logo} alt="Logo" style={{ marginRight: '10px', marginTop: '10px', width: '150px', height: '100%' }} />
            </Navbar.Brand>
        </Navbar>
    );  
}

export default InicioSesion;
