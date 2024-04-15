import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import "./LoginForm.css"
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Importa el hook useUser desde el contexto del usuario

export default function RegisterInfo() {
    const navigate = useNavigate();
    const { userDetails, setUserDetails } = useUser(); // Obtiene userDetails del contexto del usuario

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [country, setCountry] = useState('');
    const [gender, setGender] = useState('');
    const [infoValid, setInfoValid] = useState(false);

    useEffect(() => {
        // Verifica si todos los campos han sido rellenados
        if (name.trim() !== '' && date.trim() !== '' && country.trim() !== '' && gender.trim() !== '') {
            setInfoValid(true);
        } else {
            setInfoValid(false);
        }
    }, [name, date, country, gender]);
    
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };
    
    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };
    

    const handleClick = async () => {
        if (infoValid) {
            const updatedUserDetails = { ...userDetails, name: name, dateOfBirth: date, gender: gender, country: country};
            setUserDetails(updatedUserDetails);
            console.log(userDetails);
            try {
                const response = await fetch('http://34.175.117.0:8000/registro/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                });

                if (response.ok) {
                    // Si el registro es exitoso, redirige al usuario
                    navigate('/login');
                } else {
                    // Maneja errores, por ejemplo, mostrar un mensaje al usuario
                }
            } catch (error) {
                // Maneja excepciones
            }
        }
    };

    return (
        <>
            <Logo src="/imagenes/logo-musify.png" alt="Logo de Musify" />
            <Container>
                <div className='wrapper'>
                    <form action="">
                        <h1>Cuentanos sobre ti</h1>
                        <div className="input-box">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre" required />
                            <FaUser className="icon"/>
                        </div>
                        <div className="input-box date-input-box">
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Fecha de nacimiento" required />
                        </div>
                        <div className="text-right mt-4">
                        <p style={{ color: 'white', marginBottom: '10px' }}>Genero</p>
                    </div>
                    <div className="gender-options">
                        <label>
                            <input type="radio" name="gender" value="h" checked={gender === 'h'} onChange={handleGenderChange} />
                            Hombre
                        </label>
                        <label>
                            <input type="radio" name="gender" value="m" checked={gender === 'm'} onChange={handleGenderChange} />
                            Mujer
                        </label>
                        <label>
                            <input type="radio" name="gender" value="o" checked={gender === 'o'} onChange={handleGenderChange} />
                            Otro
                        </label>
                        <label>
                            <input type="radio" name="gender" value="p" checked={gender === 'p'} onChange={handleGenderChange} />
                            Prefiero no decirlo
                        </label>
                    </div>
                        <div className="select-wrapper">
                            <select name="country" id="country" value={country} onChange={handleCountryChange}>
                                <option value="">Seleccione un pais</option>
                                <option value="United States">United States</option>
                                <option value="AL">Albania</option>
                                <option value="DE">Alemania</option>
                                <option value="AD">Andorra</option>
                                <option value="AO">Angola</option>
                                <option value="AI">Anguila</option>
                                <option value="AQ">Antartida</option>
                                <option value="AG">Antigua y Barbuda</option>
                                <option value="SA">Arabia Saudita</option>
                                <option value="DZ">Argelia</option>
                                <option value="AR">Argentina</option>
                                <option value="AM">Armenia</option>
                                <option value="AW">Aruba</option>
                                <option value="AU">Australia</option>
                                <option value="AT">Austria</option>
                                <option value="AZ">Azerbaiyan</option>
                                <option value="BS">Bahamas</option>
                                <option value="BD">Banglades</option>
                                <option value="BB">Barbados</option>
                                <option value="BH">Barein</option>
                                <option value="BE">Belgica</option>
                                <option value="BZ">Belice</option>
                                <option value="BJ">Benin</option>
                                <option value="BM">Bermudas</option>
                                <option value="BY">Bielorrusia</option>
                                <option value="BO">Bolivia</option>
                                <option value="BA">Bosnia y Herzegovina</option>
                                <option value="BW">Botsuana</option>
                                <option value="BR">Brasil</option>
                                <option value="BN">Brunei</option>
                                <option value="BG">Bulgaria</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="BI">Burundi</option>
                                <option value="BT">Butan</option>
                                <option value="CV">Cabo Verde</option>
                                <option value="KH">Camboya</option>
                                <option value="CM">Camerun</option>
                                <option value="CA">Canada</option>
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
                                <option value="AE">Emiratos arabes Unidos</option>
                                <option value="ER">Eritrea</option>
                                <option value="SK">Eslovaquia</option>
                                <option value="SI">Eslovenia</option>
                                <option value="ES">Espagna</option>
                                <option value="US">Estados Unidos</option>
                                <option value="EE">Estonia</option>
                                <option value="ET">Etiopia</option>
                                <option value="PH">Filipinas</option>
                                <option value="FI">Finlandia</option>
                                <option value="FJ">Fiyi</option>
                                <option value="FR">Francia</option>
                                <option value="GA">Gabon</option>
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
                                <option value="GW">Guinea-Bisau</option>
                                <option value="GY">Guyana</option>
                                <option value="HT">Haiti</option>
                                <option value="HN">Honduras</option>
                                <option value="HU">Hungria</option>
                                <option value="IN">India</option>
                                <option value="ID">Indonesia</option>
                                <option value="IQ">Irak</option>
                                <option value="IR">Iran</option>
                                <option value="IE">Irlanda</option>
                                <option value="IS">Islandia</option>
                                <option value="IT">Italia</option>
                                <option value="JM">Jamaica</option>
                                <option value="JP">Japon</option>
                                <option value="JE">Jersey</option>
                                <option value="JO">Jordania</option>
                                <option value="KZ">Kazajistan</option>
                                <option value="KE">Kenia</option>
                                <option value="KG">Kirguistan</option>
                                <option value="KI">Kiribati</option>
                                <option value="KW">Kuwait</option>
                                <option value="LA">Laos</option>
                                <option value="LS">Lesoto</option>
                                <option value="LV">Letonia</option>
                                <option value="LB">Libano</option>
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
                                <option value="ML">Mali</option>
                                <option value="MT">Malta</option>
                                <option value="MA">Marruecos</option>
                                <option value="MQ">Martinica</option>
                                <option value="MU">Mauricio</option>
                                <option value="MR">Mauritania</option>
                                <option value="YT">Mayotte</option>
                                <option value="MX">Mexico</option>
                                <option value="FM">Micronesia</option>
                                <option value="MD">Moldavia</option>
                                <option value="MC">Monaco</option>
                                <option value="MN">Mongolia</option>
                                <option value="ME">Montenegro</option>
                                <option value="MS">Montserrat</option>
                                <option value="MZ">Mozambique</option>
                                <option value="MM">Myanmar (Birmania)</option>
                                <option value="NA">Namibia</option>
                                <option value="NR">Nauru</option>
                                <option value="NP">Nepal</option>
                                <option value="NI">Nicaragua</option>
                                <option value="NE">Niger</option>
                                <option value="NG">Nigeria</option>
                                <option value="NU">Niue</option>
                                <option value="NO">Noruega</option>
                                <option value="NC">Nueva Caledonia</option>
                                <option value="NZ">Nueva Zelanda</option>
                                <option value="OM">Oman</option>
                                <option value="NL">Paises Bajos</option>
                                <option value="PK">Pakistan</option>
                                <option value="PW">Palaos</option>
                                <option value="PA">Panama</option>
                                <option value="PG">Papúa Nueva Guinea</option>
                                <option value="PY">Paraguay</option>
                                <option value="PE">Perú</option>
                                <option value="PF">Polinesia Francesa</option>
                                <option value="PL">Polonia</option>
                                <option value="PT">Portugal</option>
                                <option value="PR">Puerto Rico</option>
                                <option value="HK">Region Administrativa Especial de Hong Kong de la República Popular China</option>
                                <option value="MO">Region Administrativa Especial de Macao de la República Popular China</option>
                                <option value="GB">Reino Unido</option>
                                <option value="CF">República Centroafricana</option>
                                <option value="CZ">República Checa</option>
                                <option value="DO">República Dominicana</option>
                                <option value="RE">Reunion</option>
                                <option value="RW">Ruanda</option>
                                <option value="RO">Rumania</option>
                                <option value="RU">Rusia</option>
                                <option value="EH">Sahara Occidental</option>
                                <option value="WS">Samoa</option>
                                <option value="AS">Samoa Americana</option>
                                <option value="BL">San Bartolome</option>
                                <option value="KN">San Cristobal y Nieves</option>
                                <option value="SM">San Marino</option>
                                <option value="MF">San Martin</option>
                                <option value="PM">San Pedro y Miquelon</option>
                                <option value="VC">San Vicente y las Granadinas</option>
                                <option value="SH">Santa Elena</option>
                                <option value="LC">Santa Lucia</option>
                                <option value="ST">Santo Tome y Principe</option>
                                <option value="SN">Senegal</option>
                                <option value="RS">Serbia</option>
                                <option value="SC">Seychelles</option>
                                <option value="SL">Sierra Leona</option>
                                <option value="SG">Singapur</option>
                                <option value="SY">Siria</option>
                                <option value="SO">Somalia</option>
                                <option value="LK">Sri Lanka</option>
                                <option value="SZ">Suazilandia</option>
                                <option value="ZA">Sudafrica</option>
                                <option value="SD">Sudan</option>
                                <option value="SS">Sudan del Sur</option>
                                <option value="SE">Suecia</option>
                                <option value="CH">Suiza</option>
                                <option value="SR">Surinam</option>
                                <option value="SJ">Svalbard y Jan Mayen</option>
                                <option value="TH">Tailandia</option>
                                <option value="TW">Taiwan</option>
                                <option value="TZ">Tanzania</option>
                                <option value="TJ">Tayikistan</option>
                                <option value="IO">Territorio Britanico del Oceano indico</option>
                                <option value="TF">Territorios Australes Franceses</option>
                                <option value="PS">Territorios Palestinos</option>
                                <option value="TL">Timor-Leste</option>
                                <option value="TG">Togo</option>
                                <option value="TK">Tokelau</option>
                                <option value="TO">Tonga</option>
                                <option value="TT">Trinidad y Tobago</option>
                                <option value="TN">Túnez</option>
                                <option value="TM">Turkmenistan</option>
                                <option value="TR">Turquia</option>
                                <option value="TV">Tuvalu</option>
                                <option value="UA">Ucrania</option>
                                <option value="UG">Uganda</option>
                                <option value="UY">Uruguay</option>
                                <option value="UZ">Uzbekistan</option>
                                <option value="VU">Vanuatu</option>
                                <option value="VE">Venezuela</option>
                                <option value="VN">Vietnam</option>
                                <option value="WF">Wallis y Futuna</option>
                                <option value="YE">Yemen</option>
                                <option value="DJ">Yibuti</option>
                                <option value="ZM">Zambia</option>
                                <option value="ZW">Zimbabue</option>
                            </select>
                        </div>
                        <button type="button" onClick={handleClick} disabled={!infoValid}>Siguiente</button>

                    </form>
                    
                </div>
            </Container>
        </>
    );
}


const Logo = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    height: 200px;
    margin-left: 15px;
    margin-top: 0px;
`;

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
.wrapper h1{
    font-size: 36px;
    text-align: center;
    margin-top: 20px;
}

.wrapper .input-box {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 50px;
    margin: 30px auto;
    margin-top: 50px;
}

.date-input-box {
    position: relative;
}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    border: 2px solid rgba(255,255,255, .2);
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    padding: 20px 45px 20px 20px;
    border: 2px solid #fff;

}

.input-box input::placeholder {
    color: #fff;
}

.input-box .icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
}

.wrapper button {
    width: 100%;
    background: #54b2e7;
    color: #fff;
    width: 100%;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    margin: 10px 0;
}

`;