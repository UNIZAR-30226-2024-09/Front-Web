import React from "react";
import Sidebar from "../Sidebar/sidebar";
import styled from "styled-components";
import Chat from "./chatBody"
import Footer from "../Footer/footer";

export default function MusifyChat(){
    return (
        <Container>
        <div className="musify__body">
            <Sidebar />
            <div className="body">
                <div className="body__contents">
                <Chat />
                </div>
            </div>
        </div>
        <div className="musify__footer">
            <Footer />
        </div>
    </Container>
    );
}



const Container = styled.div`
    max-width: 100vw;
    max-height: 100vh;
    overflow-x: hidden;
    display: grid;
    grid-template-rows: 85vh 15vh;
    .musify__body {
        display: grid;
        grid-template-columns: 23vw 77vw;
        width: 100%;
        background-color: #1a1616;
        .body {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
        }
        
        .body__contents {
            border: 1px solid white;
            border-radius: 0px;
            width: 95%;
            height: 95%; 
            overflow-y: auto;
            overflow-x: hidden;
            color: #000;
            display: flex;
            
        }
        
    } `;

