import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getTodos, createTodo, deleteTodo, updateTodo } from "../api/todos"
import { motion, AnimatePresence } from 'framer-motion'

export default function Todos() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("low")
  const [error, setError] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => getTodos(token)
  })

  const todos = data?.data?.data || []
  const pendingTodos = todos.filter(todo => todo.status === "pending")
  const completedTodos = todos.filter(todo => todo.status === "completed")

  const CreateTodo = useMutation({
    mutationFn: (todo) => createTodo(token, todo),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos'])
      setTitle("")
      setPriority("low")
    },
    onError: (err) => setError(err.response?.data?.error || "Couldn't create todo")
  })

  const DeleteTodo = useMutation({
    mutationFn: (id) => deleteTodo(token, id),
    onSuccess: () => queryClient.invalidateQueries(['todos']),
    onError: (err) => setError(err.response?.data?.error || "Couldn't delete todo")
  })

  const UpdateTodo = useMutation({
    mutationFn: ({ id, todo }) => updateTodo(token, id, todo),
    onSuccess: () => queryClient.invalidateQueries(['todos']),
    onError: (err) => setError(err.response?.data?.error || "Couldn't update todo")
  })

  const Logout = () => {
    logout()
    navigate('/login')
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Todos</h1>
            <button onClick={Logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
                Logout
            </button>
            </div>

            {/* Form */}
            <div className="flex gap-3 mb-8">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a todo..."
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-gray-800 rounded-lg px-4 py-2"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button
                onClick={() => CreateTodo.mutate({ title, priority })}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
            >
                Create
            </button>
            </div>

            {error && <p className="text-red-400 mb-4">{error}</p>}

            {/* Progress Bar */}
            <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{completedTodos.length} completed</span>
                <span>{pendingTodos.length} pending</span>
            </div>
            <div className="w-full h-3 bg-red-500 rounded-full overflow-hidden">
                <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${todos.length === 0 ? 0 : (completedTodos.length / todos.length) * 100}%` }}
                />
            </div>
            </div>

            {/* Pending */}
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">
            Pending ({pendingTodos.length})
            </h2>
            <AnimatePresence>
            <div className="flex flex-col gap-3 mb-8">
                {pendingTodos.map((todo) => (
                <motion.div
                    key={todo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex justify-between items-center bg-gray-800 px-5 py-4 rounded-xl"
                >
                    <div>
                    <p className="font-medium">{todo.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{todo.priority} priority</p>
                    </div>
                    <div className="flex gap-2">
                    <button
                        onClick={() => UpdateTodo.mutate({ id: todo._id, todo: { status: 'completed' } })}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm"
                    >
                        ✓
                    </button>
                    <button
                        onClick={() => DeleteTodo.mutate(todo._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                    >
                        ✕
                    </button>
                    </div>
                </motion.div>
                ))}
            </div>
            </AnimatePresence>

            {/* Completed */}
            <h2 className="text-xl font-semibold mb-3 text-green-400">
            Completed ({completedTodos.length})
            </h2>
            <AnimatePresence>
            <div className="flex flex-col gap-3">
                {completedTodos.map((todo) => (
                <motion.div
                    key={todo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex justify-between items-center bg-gray-800 px-5 py-4 rounded-xl opacity-60"
                >
                    <div>
                    <p className="font-medium line-through">{todo.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{todo.priority} priority</p>
                    </div>
                    <div className="flex gap-2">
                    <button
                        onClick={() => UpdateTodo.mutate({ id: todo._id, todo: { status: 'pending' } })}
                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-lg text-sm"
                    >
                        ↩
                    </button>
                    <button
                        onClick={() => DeleteTodo.mutate(todo._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                    >
                        ✕
                    </button>
                    </div>
                </motion.div>
                ))}
            </div>
            </AnimatePresence>
        </div>
    </div>
    )
}