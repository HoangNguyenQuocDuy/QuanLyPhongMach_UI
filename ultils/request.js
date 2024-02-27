import axios from "axios"

const newRequest = axios.create({
    baseURL: 'http://192.168.1.6:8000',
    withCredentials: true
})

export default newRequest