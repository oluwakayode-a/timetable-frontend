import axios from 'axios'

const getAPI = axios.create({
    baseURL: 'https://k-timetable-backend.herokuapp.com/api/',
    timeout: 10000,
})

export { getAPI }