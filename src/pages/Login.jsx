import { useState } from "react"
import {login as loginAuth} from '../api/auth'
import {register as registerAuth} from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"

export default function Login(){
    const {login} = useAuth()
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[name, setName] = useState("")
    const[isLogin,setisLogin] = useState(true)
    const[error,setError] = useState("")

    const navigate = useNavigate()
    const handleLogin = async () => {
        try {
            const response = await loginAuth(email, password)
            login(response.data)
            navigate('/todos')
        } catch (e) {
            setError(e.response?.data?.error || "Login failed")
        }
    }

    const handleRegister = async () => {
        try {
            const response = await registerAuth(name, email, password)
            login(response.data)
            navigate('/todos')
        } catch (e) {
            setError(e.response?.data?.error || "Registration failed")
        }
    }


    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {isLogin ? 'Welcome back' : 'Create account'}
            </h1>

            <div className="flex flex-col gap-4">
                {!isLogin && (
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                )}
                <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                onClick={isLogin ? handleLogin : handleRegister}
                className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
                >
                {isLogin ? 'Login' : 'Register'}
                </button>

                <p className="text-center text-gray-400 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                    onClick={() => setisLogin(!isLogin)}
                    className="text-blue-400 hover:text-blue-300 ml-1"
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
                </p>
            </div>
            </div>
        </div>
    )
}


