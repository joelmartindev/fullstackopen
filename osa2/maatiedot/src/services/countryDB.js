import axios from 'axios'
const address = 'https://restcountries.com/v3.1/'

const getAll = () => {
    const req = axios.get(`${address}all`)
    return req.then(res => res.data)
}

const exports = { 
    getAll
}

export default exports