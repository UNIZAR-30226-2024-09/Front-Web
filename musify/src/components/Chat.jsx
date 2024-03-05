import React from "react";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Messages from "./Messages";
import Input from "./Input";

export default function Chat() {
    return <Container>
        <div className='chat'>
        <div className="chatInfo">
            <IoIosArrowBack />
            <span>Taylor Group</span>
            <CgProfile />
        </div>
    </div>
    <Messages />
    <Input />
    </Container>
}


const Container = styled.div`
    .chat {
        flex: 2;
    }
    .chatInfo {
        height: 50px;
        width: 767px;
        background-color: #5d5b8d;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;