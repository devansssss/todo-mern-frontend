import { useState } from "react"
import {login} from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){

    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const navigate = useNavigate()
    const handleLogin = async () => {
        const response = await login(email,password)
        localStorage.setItem('token',response.data)
        console.log("token saved to local storage")
        navigate('/todos')
    }

    return (
        <div>
            <input 
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
            />
            <input 
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Save</button>
        </div>
    )
}


