import axios from "axios";

const API = axios.create({
    baseURL : "http://localhost:3000"
})

export const getTodos = (token) => {    
    return API.get('/todos',{
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
}


export const createTodo = (token, todo) => {
    return API.post('/todos',todo, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
}

export const deleteTodo = (token, id) => {
    return API.delete(`/todos/${id}`, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
}

export const updateTodo = (token, id, todo) => {
    return API.put(`/todos/${id}`, todo, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
}