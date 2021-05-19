import axios from 'axios'

const getAPI = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 10000,
})

export { getAPI }