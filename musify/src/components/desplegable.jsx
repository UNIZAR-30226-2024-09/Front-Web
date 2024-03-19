import React, { useState } from 'react'
import styled from "styled-components";
import {  AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai'

export default function Desplegable({ title, children}) {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
        <div className='wrapper'>
            <button onClick={() => setIsOpen((prev) => !prev)} className='button'>
                <span className='title'>{title}</span>
                {!isOpen ? (
                    <AiOutlineCaretRight />
                ) : (
                    <AiOutlineCaretDown  />
                )}
            
            </button>
            {isOpen && (
                <div className="content-box">
                    <div className="content-inner">{children}</div>
                </div>
            )}
        </div>
    </Container>
  )
}

const Container = styled.div` 
.wrapper {
    display: flex-colon;
    justify-content: flex-end;
}

.button {
    background: #54b2e7;
    color: #fff;
    padding: 8px;
    width: 100%;
    height: 50px;
    display: flex;
    font-weight: bold;
    font-size: large;
    border-radius: 8px;
    border: 4px solid transparent;
    transition: all 300ms;

}

.wrapper button:hover, .wrapper button:active {
    border-color: white;
    color: white;
}

.content-inner {
    margin-top: 10px;
    margin-left: 10px;
}

.title {
    margin-right: auto;
}
`;
