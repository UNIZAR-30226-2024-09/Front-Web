import React from 'react'
import Desplegable from './desplegable'

export default function Ayuda() {
  return (
    <div className='wrapper'>
        <h1 style={{ marginBottom: '100px' }}>Regístrate y sumérgete en sonidos exclusivos</h1>
        <Desplegable title='Inicio de Sesion'>
                contenido1
        </Desplegable>
        <Desplegable title='Imagen de Perfil'>
                contenido2
        </Desplegable>
        <Desplegable title='Nombre de Usuario'>
                contenido3
        </Desplegable>
        <Desplegable title='Cambiar Correo'>
                contenido4
        </Desplegable>
        <Desplegable title='No me acuerdo de mis datos de inicio de sesion'>
                contenido5
        </Desplegable>
    </div>
  )
}


