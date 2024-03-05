import React from "react";
import styled from "styled-components";
import Message from "./Message";


export default function Messages() {
    return <Container>
        <div className="mesagges">
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
        </div>
    </Container>
}


const Container = styled.div`
    .mesagges{
        background-color: #ddddf7;
        padding: 10px;
        height: calc(100% - 160px);
        overflow: scroll;
    }
`;