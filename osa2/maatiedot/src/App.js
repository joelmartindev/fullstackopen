import { useState, useEffect } from 'react'
import countryDB from './services/countryDB'

const Filter = ({changeFilter}) => {
  return (<div>
    find countries <input onChange={changeFilter} />
  </div>);
}

const Countries = ({ filter, countries }) => {
  const [countryChoice, setCountryChoice] = useState('')

  //remove chosen country when changing filter
  useEffect(() => {
    setCountryChoice(null);
  }, [filter]);

  //Do not render if no countries
  if (!countries) {
    console.log('Waiting for countries to render...')
    return null
  }

  if (!filter) {
    console.log('Waiting for filter to be added')
    return null
  }

  //Display countries based on filter

  const handleShow = (country) => {
    //show only clicked country
    setCountryChoice(country)
  }

  //if a country has been chosen, display it
  if (countryChoice) {
    return (
      <div>
        <h2>{countryChoice.name.common}</h2>
        <div>{countryChoice.capital}</div>
        <div>{countryChoice.area}</div>
        <b>languages:</b>
        <ul>
          {Object.values(countryChoice.languages).map(lang =>
            <li key={lang}>{lang}</li>
          )}
        </ul>
        <img src={countryChoice.flags.png} alt={countryChoice.flags.alt} />
      </div>
    )
    //else show a list
  } else {

    //Array of filtered countries
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

    //If results are empty, show a message
    if (filtered.length === 0) {
      console.log('No countries found!')
      return (
        <p>No countries found!</p>
      )
      //If countries <= 10, display countries as a list
    } else if (filtered.length <= 10) {
      console.log(filtered)
      return (
        <ul>
          {filtered.map(country =>
            <li key={country.name.common}>{country.name.common}
              <button onClick={() => {
                console.log("Clicked", country)
                handleShow(country)
              }}>show</button></li>
          )}
        </ul>
      )
    } else {
      //If countries > 10, display message and abort render
      console.log('Too many matches, specify another filter')
      return (
        <p>Too many matches, specify another filter</p>
      )
    }
  }
}

const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState(null)

  //Fetch data from API to local state
  useEffect(() => {
    countryDB
      .getAll()
      .then(data => {
        console.log('setcountries');
        setCountries(data)
      })
  }, [])

  useEffect(() => {
    if (countries)
      console.log('countries', countries)
  }, [countries])

  //On change of filter input, change filter state
  const changeFilter = (e) => {
    setNewFilter(e.target.value)
  }

  return (
    <div>
      <Filter changeFilter={changeFilter}></Filter>
      <Countries filter={newFilter} countries={countries} />
    </div>
  )

}

export default App