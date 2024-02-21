import axios from "axios"

const newRequest = axios.create({
    baseURL: 'http://192.168.9.39:8000',
    withCredentials: true
})

export default newRequest