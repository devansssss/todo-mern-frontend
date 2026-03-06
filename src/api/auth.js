import axios  from "axios";

const API = axios.create({
    baseURL: 'http://localhost:3000'
})

export const login = (email,password) => {
    return API.post('/auth/login', {email,password})
}


export const register = (name,email,password) => {
    return API.post('/auth/register', {name,email,password})
}