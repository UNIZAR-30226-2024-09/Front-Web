import React from "react";
import styled from "styled-components";
import {IoLibrary,  IoChatbubblesOutline} from "react-icons/io5";
import{ MdHomeFilled, MdSearch} from "react-icons/md";
import Playlists from "./Playlists";

export default function Sidebar() {
    return <Container>
        <div className="top__links">
            <div className="logo">
           
            </div>
            <ul>
                <li>
                    <MdHomeFilled />
                    <span>Inicio</span>
                </li>
                <li>
                    <MdSearch />
                    <span>Buscar</span>
                </li>
                <li>
                    <IoLibrary />
                    <span>Biblioteca</span>
                </li>
                <li>
                    <IoChatbubblesOutline />
                    <span>Chats Grupales</span>
                </li>
            </ul>
        </div>
    </Container>
}


const Container = styled.div`
    background-color: black;
    color: #b3b3b3;
    display: flex;
    flex-diirection: column;
    height: 100%;
    width: 100%;
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

`;