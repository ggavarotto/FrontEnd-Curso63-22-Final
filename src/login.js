import React, {useState} from 'react'; //importo los hooks
import './login.css';
import Cookies from 'universal-cookie';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Button, TextField, Link} from '@material-ui/core';
//import {DropzoneArea} from "material-ui-dropzone";

const cookies = new Cookies()

const styleForgot = {
  position: 'absolute', //position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  height: 150,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const styleNewUser = {
  position: 'absolute', //position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  height: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

function Login() {

  //----------------***********-----------------
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
        //console.log(usuario);
  }

    //----------------***********-----------------

  const [modalForgot, setModalForgot] = useState(false);    
  const handleOpenModelForgot = () => setModalForgot(true);
  const handleCloseModelForgot = () => setModalForgot(false);

    //----------------***********-----------------

  const [modalNewUser, setModalNewUser] = useState(false);    
  const handleOpenModalNewUser = () => setModalNewUser(true);
  const handleCloseModalNewUser = () => setModalNewUser(false);

  //----------------***********-----------------

  const [email, setEmail]= useState({
    email: ''
  });  

  //----------------***********-----------------

  const handleChangeEmail=e=>{
    const {name, value}=e.target;
    setEmail(prevState=>({
      ...prevState,
      [name]: value
    }))
      //console.log(email.email);
  }

  //----------------***********-----------------

  const [selectedFile, setSelectedFile] = useState(null);

  //----------------***********-----------------

  const [NewUser, setNewUser]= useState({
    nombre: '',
    email: '',
    password: '',
    file: ''
  });
        
  const handleChangeNewUser=e=>{
    const {name, value}=e.target;
    setNewUser(prevState=>({
      ...prevState,
      [name]: value
    }))
  }

  //----------------***********-----------------

  const PostLogin=()=> {          
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
      console.log(data);
      if (data.hasOwnProperty('Token_info')){
        alert('Bienvenido!');

        cookies.set('TOKEN',data.Token_info.token, {path: "/"})
        cookies.set('IMAGEN',data.Token_info.user.image, {path: "/"})
        cookies.set('EMAIL',data.Token_info.user.email, {path: "/"})
        //console.log(data.Token_info.token)
        //console.log(cookies.get('TOKEN'))
        window.location.href="./App";
      } 
      else {
          alert('Login incorrecto! - ' + data.errores[0].msg);
      }
    })
    .catch(err => {
      console.log(err);
      alert('Se produjo un error...');
    }); 
  }

  const ForgotModal=()=> {
    handleOpenModelForgot();
  }

  const NewUserModal=()=> {
    handleOpenModalNewUser();
  }

  const PostForgotPassword=()=>{
    fetch('https://apideploy-63-ggavarotto.herokuapp.com/users/forgot-password',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({      
        email: email.email
      }),
    })
    .then(response => {
      console.log('response.status: ', response.status);
      console.log(response);
      if (response.status === 200 ) {
        alert('Hemos enviado un correo con instrucciones para generar su nueva contraseña, tiene 15 min para realizar la generación...');
        handleCloseModelForgot();
      }
      else {
        alert('No fue posible realizar la operación, intente nuevamente...');
      }
    })
    .catch(err => {
      console.log(err);
      alert('Se produjo un error...');
    }); 
  }

  const PostNewUser=()=> {
    const f = new FormData()      
    f.append("file",selectedFile);
    f.append("nombre", NewUser.nombre );
    f.append("email", NewUser.email );
    f.append("password", NewUser.password );

    fetch('https://apideploy-63-ggavarotto.herokuapp.com/users/register', {
      method: "POST", 
      headers: {
      },           
      body: f
    })
    .then(response => {
      console.log('response.status: ', response.status);
      console.log(response);
      if (response.status === 201 ) {          
        alert('Usuario creado! Por favor, inicie sesión...')
        handleCloseModalNewUser();
      } else {
        alert('No fue posible realizar el alta de usuario, intente nuevamente...');
      }
    })
    .catch(err => {
      console.log(err);
      alert('Se produjo un error...');
    });   
  }
    
  return (
    <>
      <div className='Login'>
        <h1>Login</h1>
        <br></br>               
        <TextField name="email" required id="outlined-required" label="Email" size="medium" onChange={handleChange}/>   
        <br></br>
        <br></br>
        <TextField name="password" required id="outlined-required" label="Password" type="password" size="medium" onChange={handleChange}></TextField>          
        <br></br>
        <br></br>
        <Button variant="text" onClick={PostLogin} size="medium">Iniciar Sesión</Button> 
        <br></br>
        <br></br>
        <Link href="#" variant="body2" onClick={ForgotModal}>¿Olvidó su contraseña?</Link>
        <br></br>
        <br></br>         
        <Link href="#" variant="body2" onClick={NewUserModal}>¿No tiene usuario aún?</Link>
      </div>  

      <Modal
        open={modalForgot}
        onClose={handleCloseModelForgot}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleForgot}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ¿Olvidó su contraseña?
          </Typography>
          <TextField name="email" required id="outlined-required" label="Email" size="medium" onChange={handleChangeEmail}/>
          <br></br>
          <br></br>
          <Button variant="contained" onClick={PostForgotPassword}>Aceptar</Button> 
          &nbsp;&nbsp;&nbsp;
          <Button variant="contained" onClick={handleCloseModelForgot}>Cancelar</Button> 
        </Box>
      </Modal>

      <Modal
        open={modalNewUser}
        onClose={handleCloseModalNewUser}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleNewUser}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Alta de Usuario
          </Typography>
          <TextField name="nombre" required id="outlined-required" label="Nombre" size="medium" onChange={handleChangeNewUser}></TextField>
          <br></br>
          <TextField name="email" required id="outlined-required" label="Email" size="medium" onChange={handleChangeNewUser}></TextField>
          <br></br>
          <TextField name="password" required id="outlined-required" label="Password" type="password" size="medium" onChange={handleChangeNewUser}></TextField>
          <br></br>
          <TextField name="upload-photo" required id="outlined-required" label="Foto" type="file" onChange={(e) => setSelectedFile(e.target.files[0])}/>
          <br></br>
          <br></br>
          <Button variant="contained" onClick={PostNewUser}>Aceptar</Button> 
          &nbsp;&nbsp;&nbsp;
          <Button variant="contained" onClick={handleCloseModalNewUser}>Cancelar</Button> 
        </Box>
      </Modal>

    </>
  );
}

export default Login;