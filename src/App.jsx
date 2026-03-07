import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Todos from "./pages/Todos"
import ProtectedRoute from "./components/ProtectedRoute"
import { Navigate } from "react-router-dom"



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/todos" element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
