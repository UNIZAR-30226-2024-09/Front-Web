import React from "react";
import Sidebar from "./Sidebar/sidebar";
import Footer from "./Footer/footer";
import Navbar from "./Navbar/navbar";
import styled from "styled-components";

const Layout = ({ children }) => {
    return (
        <Container>
            <div className="musify__body">
                <Sidebar />
                <div className="body">
                    <Navbar />
                    <div className="body__contents">
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    );
};

const Container = styled.div`
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 85vh 15vh;
    .musify__body {
        display: grid;
        grid-template-columns: 15vw 85vw;
        height: 100%;
        width: 100%;
        background: linear-gradient(transparent, rgba(0,0,0,1));
        background-color: rgb(32, 87, 100);
        .body {
            height: 100%;
            width: 100%; 
            margin-left: 130px;
            overflow: auto;
        }
    }
`;

export default Layout;
