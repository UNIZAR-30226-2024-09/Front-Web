import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';


function useExternalScript(url) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [url]);
}

function Chat() {
    const { salaId } = useParams();
    useExternalScript("https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js");
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey everyone, how's the project going?", type: 'received' },
        { id: 2, text: "Pretty good! Just finished the new feature.", type: 'sent' },
        { id: 3, text: "Awesome! I'm working on the chat functionality.", type: 'received' },
        { id: 4, text: "I'll start with the documentation then.", type: 'sent' },
        { id: 5, text: "Could use some help with the backend later.", type: 'received' }
    ]);
    const [input, setInput] = useState('');
    const websocket = useRef(null);

    useEffect(() => {
        // Cambia el host y puerto según tu configuración de Django y asegúrate de incluir el nombre de la sala
        // Por ejemplo, si tu servidor Django corre en localhost en el puerto 8000 y la sala se llama "public"
        websocket.current = new WebSocket(`ws://localhost:8000/ws/chat/${salaId}/`);
    
        websocket.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };
    
        websocket.current.onopen = () => {
            console.log("WebSocket Conectado");
        };
    
        websocket.current.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };
    
        websocket.current.onclose = () => {
            console.log("WebSocket Desconectado");
        };
    
        // Asegúrate de cerrar el WebSocket cuando el componente se desmonte
        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [salaId]);

    useEffect(() => {
        const messageList = document.getElementById("messagesList");
        messageList.scrollTop = messageList.scrollHeight;
    }, [messages]);

    useEffect(() => {
        async function cargarMensajes() {
            try {
                const response = await fetch(`http://localhost:8000/cargarMensajesAPI/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRFToken': 'tu_token_csrf_aquí'
                    },
                    body: JSON.stringify({ salaid: salaId })
                });
                if (response.ok) {
                    const mensajesApi = await response.json();
                    const mensajesFormat = mensajesApi.map(msg => ({
                        id: msg.id,
                        text: msg.texto,
                        type: msg.miUsuario === 'zineb@gmail.com' ? 'sent' : 'received', // Cambia 'zineb@gmail.com' por el email del usuario actual
                        fecha: msg.fecha
                    }));
                    mensajesFormat.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Ordena mensajes por fecha
                    setMessages(mensajesFormat);
                } else {
                    throw new Error('No se pudo cargar los mensajes.');
                }
            } catch (error) {
                console.error("Error al cargar mensajes: ", error);
            }
        }
    
        cargarMensajes();
    }, [salaId]);  // Dependencia para que se ejecute cada vez que cambia el ID de la sala.
    

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const messageToSend = JSON.stringify({
                cuerpo: {
                    salaid: salaId,
                    emisorid: 'zineb@gmail.com',
                    mensaje: input
                }
            });
    
            try {
                const response = await fetch('http://localhost:8000/registrarMensajeAPI/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': 'tu_token_csrf_aquí'
                    },
                    body: JSON.stringify({ 
                        salaid: salaId,
                        emisorid: 'zineb@gmail.com',
                        mensaje: input 
                    })
                });
    
                if (response.ok) {
                    if (websocket.current.readyState === WebSocket.OPEN) {
                        websocket.current.send(messageToSend);
                        setInput('');
                    }
                } else {
                    throw new Error('Error al enviar mensaje.');
                }
            } catch (error) {
                console.error("Error al registrar mensaje: ", error);
            }
        }
    };

    return (
        <ChatContainer>
            <ChatHeader>
                <IoIosArrowBack size="24" style={{ cursor: 'pointer' }} />
                <ChatTitle>Taylor Swift Group</ChatTitle>
            </ChatHeader>
            <MessagesList id="messagesList">
                {messages.map((msg) => (
                    <Message key={msg.id} type={msg.type}>
                        <FaUserCircle size="24" style={{ minWidth: '24px', color: msg.type === 'sent' ? 'green' : 'gray' }} />
                        <p>{msg.text}</p>
                    </Message>
                ))}
            </MessagesList>

            <InputForm onSubmit={sendMessage}>
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <SendButton type="submit">Send</SendButton>
            </InputForm>
        </ChatContainer>
    );
}

export default Chat;

// Styled Components
const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f9f9f9;
    border-radius: 0px;
    padding: 10px;
    height: 610px;
    width: 1150px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc; // Adds a subtle line to separate the header
`;

const ChatTitle = styled.h2`
    margin-left: 15px; // Space between back arrow and title
    color: #333;
`;

const MessagesList = styled.div`
    overflow-y: auto;
    padding: 10px;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.type === 'sent' ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: ${props => props.type === 'sent' ? 'flex-end' : 'flex-start'};
    flex-direction: ${props => props.type === 'sent' ? 'row-reverse' : 'row'};
  }

  & > p {
    background-color: ${props => props.type === 'sent' ? '#DCF8C6' : '#e0e0e0'};
    border-radius: 20px;
    padding: 10px 15px;
    margin: ${props => props.type === 'sent' ? '0 10px 0 0' : '0 0 0 10px'};
    width: fit-content;
    max-width: 80%;
  }
`;

const InputForm = styled.form`
    display: flex;
    padding: 10px 0;
`;

const Input = styled.input`
    flex-grow: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    margin-right: 10px;
`;

const SendButton = styled.button`
    background-color: #575151;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
    &:hover {
        background-color: #575151;
    }
`;
