import React, {useState} from 'react'; //importo los hooks
import './login.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies()

function Login() {

    const [usuario, setUsuario]= useState({
        email: '',
        password: ''  
    });          
          
    const handleChange=e=>{
        const {name, value}=e.target;
        setUsuario(prevState=>({
            ...prevState,
            [name]: value
        }))
        console.log(usuario);
    }

    const PostLogin=()=> {
        //fetch('http://localhost:3030/users/login', {
          fetch('https://apideploy-63-ggavarotto.herokuapp.com/users/login',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({      
            email: usuario.email,
            password: usuario.password
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.hasOwnProperty('Token_info')){
            alert('Bienvenido!');

            cookies.set('TOKEN',data.Token_info.token, {path: "/"})
            cookies.set('IMAGEN',data.Token_info.user.image, {path: "/"})
            cookies.set('EMAIL',data.Token_info.user.email, {path: "/"})
            //console.log(data.Token_info.token)
            //console.log(cookies.get('TOKEN'))
            window.location.href="./App";

          }else{
            alert('Login incorrecto');
          }
        })
        .catch(err=> console.log('Solicitud fallida', err)); // Capturar errores
    }
    
    return (

      <div className='Login'>
        <label>Usuario</label>
        <br></br>
        <input name='email' type="text" onChange={handleChange}></input>
        <br></br>
        <br></br>
        <label>Contraseña</label>
        <br></br>
        <input name='password' type="password" onChange={handleChange}>
        </input>
        <br></br>
        <br></br>
        <button onClick={()=>PostLogin()}>Aceptar</button>
      </div>  

    );

}

export default Login;

