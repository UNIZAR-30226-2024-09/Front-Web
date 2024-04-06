import React, { useState } from "react";
import styled from 'styled-components';
import { FaListAlt, FaHeart, FaPlayCircle } from 'react-icons/fa';


import PerfilIcon from './panda2.jpg'; 

const usuarioPredeterminado = {
    nombre: "Daniel",
    seguidores: 100,
    seguidos: 50,
    esPublico: false,
    listas: [
        { titulo: 'Mis favoritas', descripcion: 'Canciones que más me gustan', icono: <FaHeart /> },
        { titulo: 'Para entrenar', descripcion: 'Música para motivarme', icono: <FaPlayCircle /> },
        { titulo: 'Relajación', descripcion: 'Para esos momentos de paz', icono: <FaListAlt /> },
    ]
};

function ListasUsuario({ listas }) {
    return (
        <ListasContainer>
            {listas.map((lista, index) => (
                <Lista key={index}>
                    {lista.icono}
                    <h4>{lista.titulo}</h4>
                    <p>{lista.descripcion}</p>
                </Lista>
            ))}
        </ListasContainer>
    );
}

export default function PerfilUsuario({ usuario = usuarioPredeterminado }) {
    const [siguiendo, setSiguiendo] = useState(false);

    const toggleSeguir = () => {
        setSiguiendo(!siguiendo);
    };

    return (
        <PerfilContainer>
            <ProfileIcon src={PerfilIcon} alt="Icono de perfil" />
            <NombreUsuario>{usuario.nombre}</NombreUsuario>
            <SeguidoresYSeguidos>
                <Seguidores>{usuario.seguidores} seguidores</Seguidores>
                <Seguidos>{usuario.seguidos} siguiendo</Seguidos>
            </SeguidoresYSeguidos>
            <BotonSeguir onClick={toggleSeguir}>
                {siguiendo ? "Siguiendo" : "Seguir"}
            </BotonSeguir>
            {(siguiendo || usuario.esPublico) && <ListasUsuario listas={usuario.listas} />}
            {(!siguiendo && !usuario.esPublico) && <p>Este perfil es privado. Sigue a este usuario para ver sus listas.</p>}
        </PerfilContainer>
    );
}

// Estilos aquí
const PerfilContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ProfileIcon = styled.img`
    width: 230px;
    height: 230px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const NombreUsuario = styled.div`
    font-size: 48px;
    font-weight: bold;
    color: white;
    margin-bottom: 20px;
`;

const SeguidoresYSeguidos = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    color: white;
    margin-bottom: 20px;
`;

const BotonSeguir = styled.button`
    border: none;
    background-color: #1db954;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    margin-bottom: 20px;
    &:hover {
        background-color: #17a849;
    }
`;

const ListasContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

const Lista = styled.div`
    background-color: #1db954;
    color: white;
    padding: 10px;
    border-radius: 10px;
    width: calc(100% / 3 - 20px);
    text-align: center;
`;

const Seguidores = styled.div``;

const Seguidos = styled.div``;