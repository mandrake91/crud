import React, { useState, useEffect } from 'react'
import { isEmpty, size } from 'lodash'
import shortid from 'shortid'
import { getCollection, addDocument, updateDocument, deleteDocument } from './actions'
 
function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([]) 
  const [editMode, setEditMode] = useState(false)   
  const [id, setid] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => { // este efecto se ejecuta cuando la pagina cargue, ()() doble parentesis es un metodo asyncrono autoejecutable
    (async () => {
      const result = await getCollection("tasks")
      if (result.statusResponse){
      setTasks(result.data)
    }
    })()
  }, [])
  

  const validForm = () => {
    let isValid = true
    setError(null)
    if (isEmpty(task)) {
      setError("Debes ingresar una tarea")
      isValid = false
    }
    return isValid
  }

  const addTask = async(e) => {
    e.preventDefault();
    if(!validForm()){
      return
    } 

    const result = await addDocument("tasks", {name: task}) //agrega la tarea en la colecciomn tasks
    if(!result.statusResponse){
      setError(result.error)
      return
    }
 /*   const newTask = {
      id: shortid.generate(), //genera un id valido (digamos) al objeto
      name: task
    }  */
    setTasks([...tasks, {id: result.data.id, name: task}])
    setTask("")
  }

  const deleteTask = async(id) => {
    const result = await deleteDocument("tasks", id)  
    if(!result.statusResponse){
      setError(result.error)
      return
    }
    const filteredTask = tasks.filter(task => task.id !== id)
    setTasks(filteredTask)
  }

  const editTask = (theTask) => {
    setTask(theTask.name)
    setEditMode(true)
    setid(theTask.id)
  }

  const saveTask = async(e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      console.log("Task empty")
      return;
    }
    const result = await updateDocument("tasks", id, {name : task})  
    if(!result.statusResponse){
      setError(result.error)
      return
    }
    const editedTasks = tasks.map(item => item.id === id ? {id, name: task} : item)
    setTasks(editedTasks)
    setEditMode(false)
    setTask("")
    setid("")
  }

  return (
    <div className="container mt-5">
      <h1>Tareas</h1>
      <hr/> 
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">Lista de Tareas</h4>
          {
            size(tasks) === 0 ? (
              <li className="list-group-item">Aun no hay tareas.</li>
            ) : (
              <ul className="list-group">
              {
              tasks.map((task) => ( //si ponemos parentesis en vez de corchetes obviamos el return
              <li className="list-group-item" key={task.id}>
                <span className="lead">{task.name}</span>
                <button 
                  className="btn btn-danger btn-sm float-right mx-2"
                  onClick={() => deleteTask(task.id)}
                  >
                  Eliminar
                </button>
                <button 
                  className="btn btn-warning btn-sm float-right"
                  onClick={() => editTask(task)}
                  >
                  Editar
                </button>
              </li>
              ))
              }
            </ul> 
            )
            
          }
        </div>
        <div className="col-4">
          <h4 className="text-center">
            {editMode ? "Modificar Tarea" : "Agregar Tarea"}
          </h4>
          <form onSubmit={editMode ? saveTask : addTask}>
            {
              error && <span className="text-danger">{error}</span> // && siginifica if sin else no necesita ? ni :
            }
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese la tarea...."
              onChange={(text) => setTask(text.target.value)}
              value={task}
            />
            <button 
              className={ editMode ? "btn btn-warning btn-block" : "btn btn-dark btn-block"}
              type="submit"
            >
              {editMode ? "Guardar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>      
    </div>
  )
}

export default App;
