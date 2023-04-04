import axios from 'axios'
const address = 'http://api.weatherapi.com/v1/'

const getWeather = (city) => {
    const req = axios.get(`${address}current.json?key=${process.env.REACT_APP_API_KEY}&q=${city}`)
    return req.then(res => res.data)
}

const exports = { 
    getWeather
}

export default exports