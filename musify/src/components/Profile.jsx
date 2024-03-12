import React, { useEffect } from "react";
import styled from "styled-components";
import { FaUser, FaLock, FaCaretDown, FaCalendarAlt } from "react-icons/fa"; // Importa FaCaretDown para el ícono de la flecha
import "./LoginForm.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const getUserData = () => ({
  email: "daniel@gmail.com",
  dob: "2002-01-01",
  country: "ES",
  gender: "Hombre"
});

const FormSchema = z.object({
  email: z.string().email().nonempty(),
  dob: z.string(),
  country: z.string().min(1),
});

export default function Profile() {
    const { control, handleSubmit, reset } = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        email: "",
        password: "",
        dob: "",
        country: "",
        gender: "", // Valor predeterminado vacío para género.
      }
    });
  
    useEffect(() => {
      const userData = getUserData();
      reset(userData);
    }, [reset]);
  
    const onSubmit = data => console.log(data);
  
    return (
        <>
          <Container>
            <div className='wrapper'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Editar Perfil</h1>
                
                {/* Email */}
                <div className="input-box">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <input {...field} type="email" placeholder="Correo electrónico" />}
                />
                <FaUser className="icon"/>
              </div>
              <div className="input-box">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => <input {...field} type="password" placeholder="Contraseña" />}
                />
                <FaLock className="icon" />
              </div>
  
                {/* Fecha de Nacimiento */}
                <div className="input-box date-input-box">
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => <input {...field} type="date" />}
                  />
                  <FaCalendarAlt className="icon"/>
                </div>
  
                {/* Sexo */}
                <div className="input-box">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <div className="select-container">
                           <select {...field}>
                                <option value="">Seleccione su sexo</option>
                                <option value="Mujer">Mujer</option>
                                <option value="Hombre">Hombre</option>
                                <option value="Otro">Otro</option>
                                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                            </select>
                        <FaCaretDown className="select-icon"/>
                      </div>
                    )}
                  />
                </div>
  
                {/* País */}
                <div className="select-wrapper">
                  {<select name="country" id="country">
                    <option value="">Seleccione un país</option>
                    <option value="AF">Afganistán</option>
                    <option value="AL">Albania</option>
                    <option value="DE">Alemania</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AI">Anguila</option>
                    <option value="AQ">Antártida</option>
                    <option value="AG">Antigua y Barbuda</option>
                    <option value="SA">Arabia Saudita</option>
                    <option value="DZ">Argelia</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaiyán</option>
                    <option value="BS">Bahamas</option>
                    <option value="BD">Bangladés</option>
                    <option value="BB">Barbados</option>
                    <option value="BH">Baréin</option>
                    <option value="BE">Bélgica</option>
                    <option value="BZ">Belice</option>
                    <option value="BJ">Benín</option>
                    <option value="BM">Bermudas</option>
                    <option value="BY">Bielorrusia</option>
                    <option value="BO">Bolivia</option>
                    <option value="BA">Bosnia y Herzegovina</option>
                    <option value="BW">Botsuana</option>
                    <option value="BR">Brasil</option>
                    <option value="BN">Brunéi</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="BT">Bután</option>
                    <option value="CV">Cabo Verde</option>
                    <option value="KH">Camboya</option>
                    <option value="CM">Camerún</option>
                    <option value="CA">Canadá</option>
                    <option value="QA">Catar</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CY">Chipre</option>
                    <option value="VA">Ciudad del Vaticano</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoras</option>
                    <option value="CD">Congo (Rep. Dem.)</option>
                    <option value="CG">Congo (Rep.)</option>
                    <option value="KP">Corea del Norte</option>
                    <option value="KR">Corea del Sur</option>
                    <option value="CR">Costa Rica</option>
                    <option value="CI">Costa de Marfil</option>
                    <option value="HR">Croacia</option>
                    <option value="CU">Cuba</option>
                    <option value="DK">Dinamarca</option>
                    <option value="DM">Dominica</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egipto</option>
                    <option value="SV">El Salvador</option>
                    <option value="AE">Emiratos Árabes Unidos</option>
                    <option value="ER">Eritrea</option>
                    <option value="SK">Eslovaquia</option>
                    <option value="SI">Eslovenia</option>
                    <option value="ES">España</option>
                    <option value="US">Estados Unidos</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Etiopía</option>
                    <option value="PH">Filipinas</option>
                    <option value="FI">Finlandia</option>
                    <option value="FJ">Fiyi</option>
                    <option value="FR">Francia</option>
                    <option value="GA">Gabón</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GD">Granada</option>
                    <option value="GR">Grecia</option>
                    <option value="GL">Groenlandia</option>
                    <option value="GP">Guadalupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GF">Guayana Francesa</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GQ">Guinea Ecuatorial</option>
                    <option value="GW">Guinea-Bisáu</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haití</option>
                    <option value="HN">Honduras</option>
                    <option value="HU">Hungría</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IQ">Irak</option>
                    <option value="IR">Irán</option>
                    <option value="IE">Irlanda</option>
                    <option value="IS">Islandia</option>
                    <option value="IT">Italia</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japón</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordania</option>
                    <option value="KZ">Kazajistán</option>
                    <option value="KE">Kenia</option>
                    <option value="KG">Kirguistán</option>
                    <option value="KI">Kiribati</option>
                    <option value="KW">Kuwait</option>
                    <option value="LA">Laos</option>
                    <option value="LS">Lesoto</option>
                    <option value="LV">Letonia</option>
                    <option value="LB">Líbano</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libia</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lituania</option>
                    <option value="LU">Luxemburgo</option>
                    <option value="MK">Macedonia del Norte</option>
                    <option value="MG">Madagascar</option>
                    <option value="MY">Malasia</option>
                    <option value="MW">Malaui</option>
                    <option value="MV">Maldivas</option>
                    <option value="ML">Malí</option>
                    <option value="MT">Malta</option>
                    <option value="MA">Marruecos</option>
                    <option value="MQ">Martinica</option>
                    <option value="MU">Mauricio</option>
                    <option value="MR">Mauritania</option>
                    <option value="YT">Mayotte</option>
                    <option value="MX">México</option>
                    <option value="FM">Micronesia</option>
                    <option value="MD">Moldavia</option>
                    <option value="MC">Mónaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar (Birmania)</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Níger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NO">Noruega</option>
                    <option value="NC">Nueva Caledonia</option>
                    <option value="NZ">Nueva Zelanda</option>
                    <option value="OM">Omán</option>
                    <option value="NL">Países Bajos</option>
                    <option value="PK">Pakistán</option>
                    <option value="PW">Palaos</option>
                    <option value="PA">Panamá</option>
                    <option value="PG">Papúa Nueva Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Perú</option>
                    <option value="PF">Polinesia Francesa</option>
                    <option value="PL">Polonia</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="HK">Región Administrativa Especial de Hong Kong de la República Popular China</option>
                    <option value="MO">Región Administrativa Especial de Macao de la República Popular China</option>
                    <option value="GB">Reino Unido</option>
                    <option value="CF">República Centroafricana</option>
                    <option value="CZ">República Checa</option>
                    <option value="DO">República Dominicana</option>
                    <option value="RE">Reunión</option>
                    <option value="RW">Ruanda</option>
                    <option value="RO">Rumanía</option>
                    <option value="RU">Rusia</option>
                    <option value="EH">Sahara Occidental</option>
                    <option value="WS">Samoa</option>
                    <option value="AS">Samoa Americana</option>
                    <option value="BL">San Bartolomé</option>
                    <option value="KN">San Cristóbal y Nieves</option>
                    <option value="SM">San Marino</option>
                    <option value="MF">San Martín</option>
                    <option value="PM">San Pedro y Miquelón</option>
                    <option value="VC">San Vicente y las Granadinas</option>
                    <option value="SH">Santa Elena</option>
                    <option value="LC">Santa Lucía</option>
                    <option value="ST">Santo Tomé y Príncipe</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leona</option>
                    <option value="SG">Singapur</option>
                    <option value="SY">Siria</option>
                    <option value="SO">Somalia</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SZ">Suazilandia</option>
                    <option value="ZA">Sudáfrica</option>
                    <option value="SD">Sudán</option>
                    <option value="SS">Sudán del Sur</option>
                    <option value="SE">Suecia</option>
                    <option value="CH">Suiza</option>
                    <option value="SR">Surinam</option>
                    <option value="SJ">Svalbard y Jan Mayen</option>
                    <option value="TH">Tailandia</option>
                    <option value="TW">Taiwán</option>
                    <option value="TZ">Tanzania</option>
                    <option value="TJ">Tayikistán</option>
                    <option value="IO">Territorio Británico del Océano Índico</option>
                    <option value="TF">Territorios Australes Franceses</option>
                    <option value="PS">Territorios Palestinos</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad y Tobago</option>
                    <option value="TN">Túnez</option>
                    <option value="TM">Turkmenistán</option>
                    <option value="TR">Turquía</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UA">Ucrania</option>
                    <option value="UG">Uganda</option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistán</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VE">Venezuela</option>
                    <option value="VN">Vietnam</option>
                    <option value="WF">Wallis y Futuna</option>
                    <option value="YE">Yemen</option>
                    <option value="DJ">Yibuti</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabue</option>
                    </select>

                    }
                </div>
  
                {/* Botones */}
                <div className="buttons-container">
                  <button type="button" className="cancel-button">Cancelar</button>
                  <button type="submit" className="save-button">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </Container>
        </>
      );
}

const Container = styled.div`
.wrapper {
    width: 800px;
    height: 550px;
    color: #fff;
    border-radius: 40px;
    padding: 30px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    background: rgba(0, 0, 0, 0.25);
}
  
.input-box, .date-input-box, .select-wrapper, .select-container {
    position: relative;
    width: 100%;
    margin: 30px 0;
  }

  input, select {
    width: 100%;
    height: 50px;
    background: transparent;
    outline: none;
    border: 2px solid #fff;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    padding-left: 20px;
    padding-right: 45px; /* Espacio para el ícono */
    appearance: none; /* Remueve la flecha predeterminada de select */
  }

  .icon, .select-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    pointer-events: none;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }

  .cancel-button, .save-button {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
  }

  .cancel-button {
    background-color: #f44336; /* Rojo */
    color: #fff;
  }

  .save-button {
    background-color: #4CAF50; /* Verde */
    color: #fff;
  }
`;
