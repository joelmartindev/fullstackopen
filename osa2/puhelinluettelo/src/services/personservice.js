import axios from 'axios'
const address = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(address)
}

const create = person => {
    return axios.post('http://localhost:3001/persons', person)
}

const remove = id => {
    return axios.delete(`${address}/${id}`)
}

const update = (id, update) => {
    return axios.put(`${address}/${id}`, update);
}

const exports = { 
    getAll,
    create,
    remove,
    update
}

export default exports