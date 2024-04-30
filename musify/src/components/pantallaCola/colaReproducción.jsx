import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Sidebar from "../Sidebar/sidebar";
import Footer from "../Footer/footer";
import Body_cola from "./colaBody.jsx";

export default function Musify_cola(){
    return (
        <>
            <GlobalStyle />
            <Container>
                <div className="musify__body">
                    <Sidebar />
                    <div className="body">
                        <div className="body__contents">
                            <Body_cola/>
                        </div>
                    </div>
                </div>
                <div className="musify__footer">
                    <Footer />
                </div>
            </Container>
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

const Container = styled.div`
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
