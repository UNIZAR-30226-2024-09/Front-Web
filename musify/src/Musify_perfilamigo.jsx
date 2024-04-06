import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Perfil from "./components/perfil_amigo";

export default function Musify(){
    return (
        <>
            <GlobalStyle />
            <MusifyContainer>
                <div className="musify__body">
                    <Sidebar />
                    <div className="body">
                        <div className="body__contents">
                            <Perfil />
                        </div>
                    </div>
                </div>
                <div className="musify__footer">
                    <Footer />
                </div>
            </MusifyContainer>
        </>
    );
}

const GlobalStyle = createGlobalStyle`
    body {
        background-color: #f5f5f5;
        color: #111;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: sans-serif;
    }
`;

const MusifyContainer = styled.div`
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 85vh 15vh;
    .musify__body {
        display: grid;
        grid-template-columns: 23vw 77vw;
        height: 100%;
        width: 100%;
        background: linear-gradient(transparent, rgba(0,0,0,1));
        background-color: rgb(32, 87, 100);
        .body{
            height: 100%;
            width: 100%; 
            overflow: auto;
        }
    }
`;
