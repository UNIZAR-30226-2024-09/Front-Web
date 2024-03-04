import React from "react";
import styled from "styled-components";

export default function NavbarLogin() {
    return <Container>
        {/* Contenido opcional de la Navbar aquí */}
    </Container>
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 100%;
    background-color: #000;
    color: white;
    padding: 0 2rem;
    position: fixed;
    top: 0;
    z-index: 1000;
    transition: 0.3s ease-in-out;
`;
