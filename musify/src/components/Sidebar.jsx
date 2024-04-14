import React from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import {IoLibrary,  IoChatbubblesOutline} from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import{ MdHomeFilled, MdSearch} from "react-icons/md";

export default function Sidebar() {
    return <Container>
        <div className="top__links">
            <div className="logo">
           
            </div>
            <ul>
                <li>
                    <IoMdSettings />
                    <span>Configuración</span>
                </li>
                <li>
                <Link to="/inicio" className="link">
                    <MdHomeFilled />
                    <span>Inicio</span>
                </Link>
                </li>
                <li>
                <Link to="/busqueda" className="link">
                    <MdSearch />
                    <span>Buscar</span>
                </Link>
                </li>
                <li>
                <Link to="/salas" className="link">
                    <IoChatbubblesOutline />
                    <span>Chats Grupales</span>
                </Link>
                </li>
                <div className="separator"></div>
                <li>
                    <IoLibrary />
                    <span>Biblioteca</span>
                </li>
                <ButtonContainer>
                    <ButtonStyled>Listas</ButtonStyled>
                    <ButtonStyled>Álbumes</ButtonStyled>
                    <ButtonStyled>Artistas</ButtonStyled>
                </ButtonContainer>
            </ul>
        </div>
    </Container>
}

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: none;
`;

const Container = styled.div`
    background-color: black;
    color: #b3b3b3;
    display: flex;
    flex-diirection: row;
    height: 100%;
    width: 350px;
    .top__links {
        display: flex;
        flex-direction: column;
    }
    ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        li {
            display: flex;
            gap: 1rem;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            &:hover {
                color: white;
            }

        }
    }
    .separator {
        height: 1px; 
        background-color: #fff;
        width: 300px; 
        margin: 10px auto;
    }
    .link {
        display: flex;
        gap: 1rem;
        text-decoration: none;
        color: inherit;
      }
      
`;

const ButtonStyled = styled.button`
    width: 90px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    background: #575151;
    color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0, .1);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: #575151;

    &:hover {
        background: #54b2e7;
        color: #fff;
    }
`;