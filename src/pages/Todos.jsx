import { useState } from "react"
import { getTodos } from "../api/todos"
import { createTodo } from "../api/todos"
import { deleteTodo } from "../api/todos"
import { updateTodo } from "../api/todos"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";




export default function Todos(){

    const [todos,setTodos] = useState([])
    const[title,setTitle] = useState("")
    const[priority,setPriority] = useState("low")
    const[error, setError] = useState("")
    const navigate = useNavigate()

    const CreateTodo = async () => {
        try{
            await createTodo(localStorage.getItem('token'), {title,priority})
            const response = await getTodos(localStorage.getItem('token'))
            setTodos(response.data.data)
            setTitle("")
            setPriority("low")
        }
        catch(e){
            setError(e.response?.data?.error || "Something went wrong")
        }
        
    }

    const UpdateTodo = async (id, status) => {
        try{
            await updateTodo(localStorage.getItem('token'), id, {status})
            const response = await getTodos(localStorage.getItem('token'))
            setTodos(response.data.data)
        }
        catch(e){
            setError(e.response?.data?.error || "couldnt update todo")
        }
    }

    const DeleteTodo = async (id) => {
        try{
            await deleteTodo(localStorage.getItem('token'), id)
            const response = await getTodos(localStorage.getItem('token'))
            setTodos(response.data.data)
        }
        catch(e){
            setError(e.response?.data?.error || "Something went wrong")
        }
    }
    

    const Logout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    
    useEffect(()=>  {
        const fetchTodos = async () => {
            try{
                const token = localStorage.getItem('token')
                const response = await getTodos(token)
                setTodos(response.data.data)
            }
            catch(e){
                setError(e.response?.data?.error || "Something went wrong")
            }   
        }
        fetchTodos()
    }, [])

    return (
        <div>
            <input value={title}
                onChange={(e) => setTitle(e.target.value)} />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <button onClick = {CreateTodo}>create todo</button>
            <button onClick = {Logout}>Logout</button>

            {todos.map(todo => (
                <div key = {todo._id}>
                    <p>{todo.title}</p>
                    <button onClick = {() => DeleteTodo(todo._id)}>delete todo</button>
                    <button onClick={() => UpdateTodo(todo._id, todo.status === 'pending' ? 'completed' : 'pending')}>
                        {todo.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                    </button>

                </div>
            ))}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}


