import { useState, useEffect } from 'react'
import personservice from './services/personservice'

const Notification = ({ message }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  if (message.includes('Error:')) {
    return (
      <div style={errorStyle} className="error">
      {message}
      </div>
    )
  } else {
    return (
      <div style={successStyle} className="error">
      {message}
      </div>
    )
  }
}

const Filter = ({ handleSearch }) => {
  return (
    <div>
      filter shown with <input onChange={handleSearch} />
    </div>)
}

const PersonForm = ({ handleSubmit, handleNameChange, handleNumberChange }) => {
  return (<form onSubmit={handleSubmit}>
    <div>
      name: <input onChange={handleNameChange} />
    </div>
    <div>
      number: <input onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>)
}

const Persons = ({ persons, newFilter, handleDelete }) => {

  const numbersToShow =
    newFilter === ''
      ? persons
      : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    numbersToShow.map(person =>
      <p key={person.id}>{person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
      </p>
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault();

    //no id
    const person = {
      name: newName,
      number: newNumber,
      id: Math.floor(Math.random() * 51)
    }

    if (newName === '' || newNumber === '') return alert('No new information')

    //If person exists
    if (persons.some((p) => p.name === newName)) {
      //If user wants to update
      if (window.confirm(`${newName} is already added to phonebook, replace number?`)) {
        const previousPerson = persons.find(p => p.name === newName);
        personservice
          //Update database
          .update(previousPerson.id, { ...previousPerson, number: newNumber })
          .then(response => {
            //Update state
            setPersons(persons.map(p => (p.name === newName ? response.data : p)))
            console.log('updated number')
            setErrorMessage(`Updated number of ${response.data.name}`)
          })
          //Display error message
          .catch(error => {
            setErrorMessage('Error: updating failed')
            //Remove error after 5 seconds
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            console.log(error.response.data)
          })

        //User declined to update
      } else return

      //Else add new person
    } else {

      //If number is not unique, abort
      if (persons.some(p => p.number === newNumber)) {
        return alert(`${newNumber} is already added to phonebook`)
      }

      personservice
        //Add to database
        .create(person)
        .then(response => {
          //Add to state
          setPersons(persons.concat(response.data))
          console.log('Created contact', response.data)
          setErrorMessage(`Added ${response.data.name}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage('Error: adding person failed')
          //Remove error after 5 seconds
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.log(error.response.data)
        })
    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleSearch = (e) => {
    setNewFilter(e.target.value)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      console.log('deleting ', id)
      personservice
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          console.log(`Deleted ${name}`)
          setErrorMessage(`Deleted ${name}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage('Error: deleting failed')
          //Remove error after 5 seconds
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.log(error.response.data)
        })
    }
  }

  useEffect(() => {
    personservice
      .getAll()
      .then(response => {
        setPersons(response.data)
        console.log('Fetched numbers')
      })
  }, [])

  // do not render anything if persons is still null
  if (!persons) { 
    return null 
  }

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter handleSearch={handleSearch}></Filter>
      <h2>add a new</h2>
      <PersonForm handleSubmit={handleSubmit} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} handleDelete={handleDelete} />
    </div>
  )

}

export default App