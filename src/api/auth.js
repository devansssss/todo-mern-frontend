import axios  from "axios";

const API = axios.create({
    baseURL: 'https://todo-mern-backend-obw2.onrender.com'
})

export const login = (email,password) => {
    return API.post('/auth/login', {email,password})
}


export const register = (name,email,password) => {
    return API.post('/auth/register', {name,email,password})
}