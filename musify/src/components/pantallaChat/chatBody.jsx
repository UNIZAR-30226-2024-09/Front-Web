import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';


function useExternalScript(url) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false; // Load script synchronously
        script.defer = true; // Defer script execution until HTML parsing is complete
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [url]);
}
function Chat() {
    const { salaId } = useParams();
    useExternalScript("https://unpkg.com/htmx.org/dist/htmx.js");
    useExternalScript("https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [messageCounter, setMessageCounter] = useState(0);

    const websocket = useRef(null);
    const [uniqueMessageIds, setUniqueMessageIds] = useState(new Set()); // Maintain a set of unique message IDs


    
    useEffect(() => {
        if (localStorage.getItem('userToken')) {
            const fetchUserDetails = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/obtenerUsuarioSesionAPI/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem('userToken'),
                        }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUserEmail(data.correo);
                    } else {
                        console.error('Failed to fetch user details:', data);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };
            
            if (localStorage.getItem('userToken')) {
                fetchUserDetails();
            }            
            return () => {
                if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                    websocket.current.close();
                    console.log('WebSocket connection closed.');
                }
            };
        }
    }, []);
    

    useEffect(() => {
        // Cambia el host y puerto según tu configuración de Django y asegúrate de incluir el nombre de la sala
        // Por ejemplo, si tu servidor Django corre en localhost en el puerto 8000 y la sala se llama "public"
        websocket.current = new WebSocket(`ws://localhost:8000/ws/chat/${salaId}/`);
    
        websocket.current.onmessage = (event) => {
            const newId = messageCounter + 1;
            setMessageCounter(newId);
            const newMessage = { ...JSON.parse(event.data), id: newId };
        
            if (!uniqueMessageIds.has(newMessage.id)) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        ...newMessage,
                        type: newMessage.cuerpo.emisorid === userEmail ? 'sent' : 'received',
                        text: newMessage.cuerpo ? newMessage.cuerpo.mensaje : '', // Adjust this to match the structure of your message data
                        userId: newMessage.cuerpo.emisorid === userEmail ? 'You' : newMessage.cuerpo.emisorid,
                    }
                ]);
                
                setUniqueMessageIds(prevIds => new Set(prevIds).add(newMessage.id));
            }
        };
        
    
        websocket.current.onopen = () => {
            console.log("WebSocket Conectado");
        };
    
        websocket.current.onerror = (errorEvent) => {
            console.error("WebSocket Error: ", errorEvent);
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
        
    }, [salaId, uniqueMessageIds, userEmail]);

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
                        text: msg.texto, // Make sure this property name matches the one returned from the API
                        type: msg.miUsuario === userEmail ? 'sent' : 'received',
                        userId: msg.miUsuario,
                        fecha: msg.fecha
                    }));
                    mensajesFormat.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                    setMessages(mensajesFormat);
                } else {
                    throw new Error('No se pudo cargar los mensajes.');
                }
            } catch (error) {
                console.error("Error al cargar mensajes: ", error);
            }
        }
        cargarMensajes();
    }, [salaId, userEmail]); // Make sure to include userEmail as a dependency
    

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const messageToSend = JSON.stringify({
                cuerpo: {
                    mensaje: input,
                    emisorid: userEmail,
                    salaid: salaId
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
                        emisorid: userEmail,
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
                {messages.map((msg, index) => (
                    <Message key={`${msg.id}-${index}`} type={msg.type}>
                        <FaUserCircle size="24" style={{ minWidth: '24px', color: msg.type === 'sent' ? 'green' : 'gray' }} />
                        <span>{msg.type === 'sent' ? 'You' : msg.userId}</span>
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
