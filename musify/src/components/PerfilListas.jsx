import React from 'react';
import styled from 'styled-components';
import { FaListAlt, FaHeart, FaPlayCircle } from 'react-icons/fa';

// Suponiendo que tienes estas listas para el perfil
const listasEjemplo = [
    { titulo: 'Mis favoritas', descripcion: 'Canciones que más me gustan', icono: <FaHeart /> },
    { titulo: 'Para entrenar', descripcion: 'Música para motivarme', icono: <FaPlayCircle /> },
    { titulo: 'Relajación', descripcion: 'Para esos momentos de paz', icono: <FaListAlt /> },
];

const ListaCard = styled.div`
    background-color: #2C3E50; // Un color de fondo diferente
    color: white; // Texto blanco para contraste
    padding: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    width: calc(100% / 3 - 20px); // Tres listas por fila
    box-shadow: 0 4px 8px rgba(0,0,0,0.1); // Una ligera sombra para profundidad

    &:hover {
        background-color: #34495E; // Un efecto al pasar el mouse
    }
`;

const IconWrapper = styled.div`
    font-size: 2.5rem; // Un tamaño de icono adecuado
    color: #E74C3C; // Color para los iconos
`;

const ListaInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ListaTitulo = styled.h3`
    margin: 0;
    font-weight: bold;
`;

const ListaDescripcion = styled.p`
    margin: 0;
`;

// Componente de Listas actualizado
const ListasContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center; // Centra las tarjetas si no llenan una fila completa
`;

const PerfilListas = ({ listas = listasEjemplo }) => {
    return (
        <ListasContainer>
            {listas.map((lista, index) => (
                <ListaCard key={index}>
                    <IconWrapper>{lista.icono}</IconWrapper>
                    <ListaInfo>
                        <ListaTitulo>{lista.titulo}</ListaTitulo>
                        <ListaDescripcion>{lista.descripcion}</ListaDescripcion>
                    </ListaInfo>
                </ListaCard>
            ))}
        </ListasContainer>
    );
};

export default PerfilListas;
