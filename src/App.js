import './App.css';
import React, {useEffect, useState} from 'react'; //importo los hooks
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Button, TextField} from '@material-ui/core' ////npm i @material-ui/core
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { textAlign } from '@mui/system';
import Cookies from 'universal-cookie';

//npm install @emotion/styled
//npm install @emotion/react 
//npm i @mui/material  
//npm install @mui/material @emotion/react @emotion/styled

const cookies = new Cookies()

const styleAgregar = {
  position: 'absolute', //position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  height: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const styleModifDel = {
  position: 'absolute', 
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  height: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

function App() {

    const [data, setData] = useState([]);

    const [modalinsert, setModalInsert] = useState(false);    
    const handleOpenInsert = () => setModalInsert(true);
    const handleCloseInsert = () => setModalInsert(false);

    const [modaledit, setModalEdit] = useState(false);    
    const handleOpenEdit = () => setModalEdit(true);
    const handleCloseEdit = () => setModalEdit(false);

    const [modaldel, setModalDel] = useState(false);    
    const handleOpenDel = () => setModalDel(true);
    const handleCloseDel = () => setModalDel(false);

    //este lo uso para saber que producto le paso al modal
    const [productoseleccionado, setproductoseleccionado]= useState({
      id: '',
      producto: '',
      categoria: '',
      descripcion: '',
      precio: '' ,
      imagen: ''    
    });
    
    //a medida que llena la pantalla en el onchange se va capturando y se almacena en el estado
    const handleChange=e=>{
      const {name, value}=e.target;
      setproductoseleccionado(prevState=>({
        ...prevState,
        [name]: value
      }))
    }

    const reload=e=>{
      window.location.reload();
    }

    const CerrarSesion=e=>{
      console.log("XXX");
      cookies.remove('TOKEN', {path: "/"});
      cookies.remove('IMAGEN', {path: "/"});
      cookies.remove('EMAIL', {path: "/"});      
      window.location.href='/';
    }    

     //este lo uso para saber que archivo selecciono
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const PostProducto=()=> {
      const f = new FormData()      
      f.append("file",selectedFile);
      f.append("producto", productoseleccionado.producto );
      f.append("categoria", productoseleccionado.categoria );
      f.append("descripcion", productoseleccionado.descripcion );
      f.append("precio", productoseleccionado.precio );

      fetch('https://apideploy-63-ggavarotto.herokuapp.com/posts', {method: "POST", 
      headers: {
        'Authorization': `Bearer ${cookies.get('TOKEN')}`,
      },           
      body: f})
      .then(response => response.json())
      .then(data => console.log(data));
      //.catch(error=> console.error(error));
      handleCloseInsert();
      //window.location.reload();
    }

    const PatchProducto=()=> {
      //console.log(productoseleccionado);
      fetch(`https://apideploy-63-ggavarotto.herokuapp.com/posts/${productoseleccionado.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({      
          producto: productoseleccionado.producto,
          categoria: productoseleccionado.categoria,
          descripcion: productoseleccionado.descripcion,
          precio: productoseleccionado.precio
        }),
      })
        .then(response => response.json())
        //.then(data => console.log(data));
        .catch(error=> console.error(error));
        handleCloseEdit();
        //window.location.reload();    
    }

    const DeleteProducto=()=> {
      //console.log(productoseleccionado);
      fetch(`https://apideploy-63-ggavarotto.herokuapp.com/posts/${productoseleccionado.id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => console.log(data));
        handleCloseDel();
        //window.location.reload();    
    }

    const seleccionarProducto=(id,producto,categoria,descripcion,precio,imagen)=>{
      setproductoseleccionado({id:id,producto:producto,categoria:categoria,descripcion:descripcion,precio:precio,imagen:imagen})
      handleOpenEdit();
    }

    const seleccionarProductoDelete=(id,producto,categoria,descripcion,precio,imagen)=>{
      setproductoseleccionado({id:id,producto:producto,categoria:categoria,descripcion:descripcion,precio:precio,imagen:imagen});
      handleOpenDel();
    } 

    useEffect(() => {   
      //console.log(cookies.get('TOKEN'));
      fetch('https://apideploy-63-ggavarotto.herokuapp.com/posts/')
      .then(res => res.json())
      .then(data => setData(data))
    },[]); //este de aca evita que se recargue

  return (
    <>
    <div className='cabecera'>
      <h1>Administración Galeria de Productos Sukata BJJ</h1>
      <Button variant="contained" onClick={handleOpenInsert}>Agregar</Button>
      &nbsp;
      &nbsp;
      <Button variant="contained" onClick={reload}>Refresh</Button>
    </div>
    
    <TableContainer>
      <table>
        <TableHead>           
          <TableRow>
            <TableCell align='center'>ID</TableCell>
            <TableCell align='center'>Producto</TableCell>
            <TableCell align='center'>Categoria</TableCell>
            <TableCell align='center'>Descripcion</TableCell>
            <TableCell align='center'>Precio</TableCell>
            <TableCell align='center'>Imagen</TableCell>
            <TableCell align='center'>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map(producto=>(
            <TableRow key={producto.id}>
              <TableCell>{producto.id}</TableCell> 
              <TableCell>{producto.producto}</TableCell>         
              <TableCell>{producto.categoria}</TableCell>     
              <TableCell>{producto.descripcion}</TableCell>
              <TableCell>{producto.precio}</TableCell>
              <TableCell><img src={producto.imagen} width="50" height="50" alt="Producto"></img></TableCell>
              <TableCell>
                <Button variant="contained" onClick={()=>seleccionarProducto(producto.id,producto.producto,producto.categoria,producto.descripcion,producto.precio,producto.imagen)}>Modificar</Button>       
                &nbsp;&nbsp;&nbsp;       
                <Button variant="contained" onClick={()=>seleccionarProductoDelete(producto.id,producto.producto,producto.categoria,producto.descripcion,producto.precio,producto.imagen)}>Borrar</Button>
              </TableCell>
            </TableRow>     
          ))}
        </TableBody> 
      </table>
    </TableContainer>

    <footer className="pie">
      <img src={cookies.get('IMAGEN')} width="30" height="30" alt="Usuario"></img>
      &nbsp;&nbsp;
      <label>{cookies.get('EMAIL')}</label>
      &nbsp;&nbsp;
      <Button variant="contained" onClick={()=>CerrarSesion()}>LogOut</Button>
    </footer>
    
    <Modal
      open={modalinsert}
      onClose={handleCloseInsert}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={styleAgregar}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Agregar Producto
        </Typography>
        <TextField name="producto" label="Producto" size="medium" onChange={handleChange}></TextField>
        <br></br>
        <TextField name="categoria" label="Categoria" onChange={handleChange}></TextField>
        <br></br>
        <TextField name="descripcion" label="Descripcion" onChange={handleChange}></TextField>
        <br></br>
        <TextField name="precio" label="Precio" onChange={handleChange}></TextField>
        <br></br>
        <br></br>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}/>
        <input
          type="file"          
          onChange={(e) => setSelectedFile(e.target.files[0])}/>        
        <br></br>
        <br></br>
        <Button variant="contained" onClick={PostProducto}>Aceptar</Button> 
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" onClick={handleCloseInsert}>Cancelar</Button> 
      </Box>
    </Modal>

    <Modal
      open={modaledit}
      onClose={handleCloseEdit}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={styleModifDel}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Editar Producto
        </Typography>
        <TextField name="id" label="ID" value={productoseleccionado.id}></TextField>
        <br></br>
        <TextField name="producto" label="Producto" value={productoseleccionado.producto} onChange={handleChange}></TextField>
        <br></br>
        <TextField name="categoria" label="Categoria" value={productoseleccionado.categoria} onChange={handleChange}></TextField>
        <br></br>
        <TextField name="descripcion" label="Descripcion" value={productoseleccionado.descripcion} onChange={handleChange}></TextField>
        <br></br>
        <TextField name="precio" label="Precio" value={productoseleccionado.precio} onChange={handleChange}></TextField>        
        <br></br>
        <br></br>
        <img src={productoseleccionado.imagen} width="100" height="100" alt="Producto"></img>
        <br></br>
        <br></br>
        <Button variant="contained" onClick={PatchProducto}>Aceptar</Button> 
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" onClick={handleCloseEdit} >Cancelar</Button> 
      </Box>
    </Modal>

    <Modal
      open={modaldel}
      onClose={handleCloseDel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={styleModifDel}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Borrar producto
        </Typography>
        <TextField name="id" label="ID" value={productoseleccionado.id}></TextField>
        <br></br>
        <TextField name="producto" label="Producto" value={productoseleccionado.producto}></TextField>
        <br></br>
        <TextField name="categoria" label="Categoria" value={productoseleccionado.categoria}></TextField>
        <br></br>
        <TextField name="descripcion" label="Descripcion" value={productoseleccionado.descripcion}></TextField>
        <br></br>
        <TextField name="precio" label="Precio" value={productoseleccionado.precio}></TextField>        
        <br></br>
        <br></br>
        <img src={productoseleccionado.imagen} width="100" height="100" alt="Producto"></img>
        <br></br>
        <br></br>
        <Button variant="contained" onClick={DeleteProducto}>Aceptar</Button> 
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" onClick={handleCloseDel} >Cancelar</Button> 
      </Box>
    </Modal>

    </>
  );
}

export default App;