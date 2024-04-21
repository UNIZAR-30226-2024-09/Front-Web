import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({
      correo: '',
      nombre: '',
      sexo: '',
      nacimiento: '',
      contrasegna: '',
      pais: '',
    });
  
    return (
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserContext.Provider>
    );
  };
  