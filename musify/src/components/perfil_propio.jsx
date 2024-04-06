import React from 'react';
import styled from 'styled-components';
import Listas from './PerfilListas';
import { FaListAlt, FaHeart, FaPlayCircle } from 'react-icons/fa';

import ProfileIcon from './panda.jpg'; 

// Valores predeterminados para un usuario de ejemplo
const usuarioPredeterminado = {
    nombre: "Zineeeb",
    seguidores: 100,
    seguidos: 50,
    listas: [ // Ejemplo de datos para las listas
        { titulo: 'Mis favoritas', descripcion: 'Canciones que más me gustan', icono: <FaHeart /> },
        { titulo: 'Para entrenar', descripcion: 'Música para motivarme', icono: <FaPlayCircle /> },
        { titulo: 'Relajación', descripcion: 'Para esos momentos de paz', icono: <FaListAlt /> },
    ]
};

const PerfilPropio = ({
    usuario = usuarioPredeterminado.nombre,
    seguidores = usuarioPredeterminado.seguidores,
    seguidos = usuarioPredeterminado.seguidos,
    listas = usuarioPredeterminado.listas
}) => {
    return (
        <PerfilContainer>
            <PerfilIcon src={ProfileIcon} alt="Icono de perfil" />
            <NombreUsuario>{usuario}</NombreUsuario>
            <SeguidoresYSeguidos>
                <Seguidores>{seguidores} seguidores</Seguidores>
                <Seguidos>{seguidos} siguiendo</Seguidos>
            </SeguidoresYSeguidos>
            <Listas listas={listas} />
        </PerfilContainer>
    );
};

export default PerfilPropio;

const PerfilContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const PerfilIcon = styled.img`
    width: 230px;
    height: 230px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const NombreUsuario = styled.div`
    font-size: 48px;
    font-weight: bold;
    color: white;
    margin-bottom: 20px; // Espacio entre el nombre de usuario y seguidores/seguidos
`;

const SeguidoresYSeguidos = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    color: white;
    margin-bottom: 20px; // Espacio antes de la sección de listas
`;


const IconoYListasContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
`;

const ListasTitulo = styled.h2`
    font-size: 24px;
    color: white;
    margin-bottom: 10px; // Espacio entre el título de Listas y las listas mismas
`;

const ListasContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%; // Asegura que las listas ocupen el ancho disponible
`;

const Lista = styled.div`
    background-color: #1db954;
    color: white;
    padding: 10px;
    border-radius: 10px;
    width: calc(100% / 3 - 20px); // Ajuste para que quepan 3 listas en una fila
    text-align: center;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    color: white;
`;

const Seguidores = styled.div`
    font-size: 16px;
`;

const Seguidos = styled.div`
    font-size: 16px;
`;