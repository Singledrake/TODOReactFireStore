import React, {useState, useEffect} from 'react'
import {store} from './firebase.config'


function App() {

  const [idUser, setIdUser]= useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [users, setUsers] = useState([]);
  const [errorApp, setErrorApp] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [modeEdit, setModeEdit] = useState(null);

  const newContact = async (e)=>{
    e.preventDefault();
    if(name === '' && phone === '' ){
      setErrorApp("No haz intruducido los datos de contacto");
    }else if(name === ''){
      setErrorApp("Debes intruducir el nombre del contacto");
    }else if(isNaN(phone)){
      setErrorApp("El telefono debe contener solo numero");
    }
    else if(phone === ''){
      setErrorApp("Debes introducir el teléfono del contacto");
    }
    else{
      const usuario ={
        name, 
        phone
      }
      try {
        const data = await store.collection('agenda').add(usuario);
        setPhone('');
        setName('');
        setCorrect('Contacto Agregado');
        
        setErrorApp(null);
        const { docs } = await store.collection('agenda').get();
        const nuevoArray = docs.map(item=>({ id:item.id, ...item.data() }));
        setUsers(nuevoArray);
        setTimeout(()=>{
          setCorrect(null);
        },1000);
      } catch (error) {
        console.log(error);
      }
      
    }
  };

  useEffect(()=>{
    const listContacts = async()=>{
        const { docs } = await store.collection('agenda').get();
        const nuevoArray = docs.map(item=>({ id:item.id, ...item.data() }));
        setUsers(nuevoArray);
      };
      listContacts();
    }, []);

  const deleteContact = async(id)=>{
    try {
      await store.collection('agenda').doc(id).delete();
      const { docs } = await store.collection('agenda').get();
      const nuevoArray = docs.map(item=>({ id:item.id, ...item.data() }));
      setUsers(nuevoArray);
    } catch (error) {
      console.log(error);
    }
  }

  const editContact = async(id)=>{
    try {
      const data = await store.collection('agenda').doc(id).get();
      setName(data.data().name);
      setPhone(data.data().phone);
      setIdUser(id);
      setModeEdit(true);
    } catch (error) {
      console.log(error);
    }
  }
  const setUpdate= async(e)=>{
    e.preventDefault();
    if(name === '' && phone === '' ){
      setErrorApp("No haz intruducido los datos de contacto");
    }else if(name === ''){
      setErrorApp("Debes intruducir el nombre del contacto");
    }else if(isNaN(phone)){
      setErrorApp("El telefono debe contener solo numero");
    }
    else if(phone === ''){
      setErrorApp("Debes introducir el teléfono del contacto");
    }
    else{
      const userUpdate ={
        name, 
        phone
      }
      try {
        const data = await store.collection('agenda').doc(idUser).set(userUpdate);
        setPhone('');
        setName('');
        setCorrect('Contacto Actualizado');
        setModeEdit(false);
        setErrorApp(null);
        const { docs } = await store.collection('agenda').get();
        const nuevoArray = docs.map(item=>({ id:item.id, ...item.data() }));
        setUsers(nuevoArray);
        setTimeout(()=>{
          setCorrect(null);
        },1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="row">
      <div className="col">
        <h2 className=" text-center m-3">Formulario de Usuarios</h2>
        <form onSubmit={modeEdit? setUpdate: newContact} className="form-group m-3">
          <input 
          onChange={(e)=> setName(e.target.value)}
          className="form-control mt-2" 
          type="text" 
          placeholder="Nombre" value={name}/>
          <input 
          onChange={(e)=> setPhone(e.target.value)}
          className="form-control mt-2" 
          type="text" 
          placeholder="Número" value={phone}/>
          {
            modeEdit ?
            (
              <input type="submit" value="Actualizar" className="btn btn-dark btn-block mt-2"/>
            ):
            (
              <input type="submit" value="Registrar" className="btn btn-dark btn-block mt-2"/>
            )
          }
          
        </form>
        {
          errorApp ?
          (
            <div className="alert alert-danger text-center">{errorApp}</div>
          ):
          (
            <span></span>
          )
        }
        {
          correct ?
          (
            <div className="alert alert-success text-center">{correct}</div>
          ):
          (
            <span></span>
          )
        }
      </div>
      <div className="col">
        <h2 className=" text-center m-3">Lista de tu agenda</h2>
        <ul className="list-group">
          {
            users.length!== 0 ?(
              users.map(item=>
                <li className="list-group-item" key={item.id}>
                  <div className="row">
                    <div className="col-xs-12 col-md-6">
                      <p><strong>Nombre: </strong>{item.name}</p>
                      <small><strong>Telefono: </strong>{item.phone} </small>
                    </div>
                    <div className="col-xs-12 col-md-6 text-center m-2">
                      <button 
                        onClick={(id)=>{ deleteContact(item.id) }} 
                        type="button"
                        className="btn btn-outline-danger m-1">
                          Eliminar
                      </button>
                      <button 
                        onClick={(id)=>{ editContact(item.id) }} 
                        type="button"
                        className="btn btn-outline-info m-1">
                          Modificar
                      </button>
                    </div>
                  </div>
                  
                  
                </li>
              )
                
            )
            :
            (
              <span>
                Aún no haz Registrado Usuarios
              </span>
            )
          }
        </ul>
        
      </div>
    </div>
  );
}

export default App;
