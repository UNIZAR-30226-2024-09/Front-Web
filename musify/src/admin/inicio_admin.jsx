import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { LuListMusic } from "react-icons/lu";
import { IoIosAdd } from "react-icons/io";
import { RiPlayList2Fill } from "react-icons/ri";

export default function InicioAdmin() {
    const navigate = useNavigate();

    return (
        <>
            <Container>
                <Header>
                    <StyledCgProfile />
                </Header>
                <FlexContainer>
                    <FlexContainerTop>
                        <IconWrapper className='wrapper1'>
                            <h2>Lista de canciones</h2>
                            <StyledLuListMusic />
                        </IconWrapper>
                        <IconWrapper className='wrapper2'>
                            <h2>Lista de podcasts</h2>
                            <StyledRiPlayList2Fill />
                        </IconWrapper>
                    </FlexContainerTop>
                    <FlexContainerBottom>
                        <IconWrapper className='wrapper3'>
                            <h2>Añadir canción</h2>
                            <StyledIoIosAdd />
                        </IconWrapper>
                        <IconWrapper className='wrapper4'>
                            <h2>Añadir podcast</h2>
                            <StyledIoIosAdd />
                        </IconWrapper>
                    </FlexContainerBottom>
                </FlexContainer>
            </Container>
        </>
    );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    min-height: 100vh;
    background: none;
    color: #fff;
    animation: ${fadeIn} 0.8s ease-out;
    border:none;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1150px;
    margin-bottom: 50px;

    h1 {
        font-size: 2.5rem;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 50px;
    width: 1100px;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const FlexContainerTop = styled.div`
`;

const FlexContainerBottom = styled.div`
`;

const IconWrapper = styled.div`
    width: 400px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background: none;
    border-radius: 20px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-10px);
    }

    h2 {
        font-size: 1.75rem;
        color: #ffffff;
        margin-bottom: 20px;
    }
`;

const iconStyle = `
    font-size: 8rem;
    color: #fff;
`;

const StyledLuListMusic = styled(LuListMusic)`
    ${iconStyle}
`;

const StyledRiPlayList2Fill = styled(RiPlayList2Fill)`
    ${iconStyle}
`;

const StyledIoIosAdd = styled(IoIosAdd)`
    ${iconStyle}
`;

const StyledCgProfile = styled(CgProfile)`
    font-size: 3rem;
    color: #fff;
    cursor: pointer;
    transition: transform 0.2s ease;
    margin-left: auto;

    &:hover {
        transform: scale(1.1);
    }
`;