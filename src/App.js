import React, { useState, useEffect }  from 'react'
import axios from 'axios'

const App = () => {
  const [ newFilter, setNewFilter] = useState('')
  const [ countries, setCountries ] = useState([ ])
  const [ showInfo, setShowInfo] = useState(false)
  const [ showWeather, setShowWeather] = useState([])
  let rows
  let weather
  console.log(countries)

  const handleFilterChange = (event) => {
    console.log("event target value", event.target.value)
    setNewFilter(event.target.value)
  }

  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('response', response)
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  let countriesToShow = newFilter === ''
  ? []
  : countries.filter(country => country.name.includes(newFilter))

  const latlong = countries.latlng

  console.log('latlong', latlong)



  console.log('filter', newFilter)
  console.log('countries to show', countriesToShow)
  console.log('countries to show language', countriesToShow.languages)
  console.log('lat long', countriesToShow.latlng)



  const OneCountry = (props) => {
    console.log('one country', props)
    return (
      <div>
        <h2>{props.name}</h2>
        <p><b>Capital: </b>{props.capital}</p>
        <p><b>Population: </b>{props.population}</p>
        <h2>Languages</h2>
        <ul>
          {props.languages.map(l =>
            <li>{l.name}</li>
          )}
        </ul>
        <img src={`${props.flag}`} width="300" height="200" alt="Country flag"/>
        <h2>Weather in {props.name}</h2>
      </div>
    )
  }

  const matchingCountry = () => countriesToShow.map(c =>
    <OneCountry
      name={c.name}
      capital={c.capital}
      population={c.population}
      key={c.name}
      flag={c.flag}
      languages={c.languages}
    />
  )

  const ShowCountry = (props) => {
    console.log('props language', props.langauge)
    return (
      <div>
        <h2>{props.name}</h2>
        <p><b>Capital: </b>{props.capital}</p>
        <p><b>Population: </b>{props.population}</p>
        <h2>Languages</h2>
        <ul>
          {props.languages.map(l =>
            <li>{l.name}</li>
          )}
        </ul>
        <img src={`${props.flag}`} width="300" height="200" alt="Country flag"/>
      </div>
    )
  }

  const showMatchingCountry = () => countriesToShow.map(c =>
    <ShowCountry
      name={c.name}
      capital={c.capital}
      population={c.population}
      key={c.name}
      flag={c.flag}
      languages={c.languages}
    />
  )

  const LessThanTenCountries = (props) => {
    console.log('props', props)
    return (
      <div>
        <h2>{props.name}
          <button onClick={() => setShowInfo(!showInfo)}>
            Show
          </button>
        </h2>
        <p>{showInfo ? showMatchingCountry() : "Click show for more info" }</p>
      </div>
    )
  }

  const matching10Countries = () => countriesToShow.map(c =>
    <LessThanTenCountries
      name={c.name}
      key={c.name}
    />
  )

  const ManyCountries = () => {
    return (
      <div>
        <p>"Too many results, please be more specific"</p>
      </div>
    )
  }

  if (countriesToShow.length > 10) {
    rows = ManyCountries
  } else if (countriesToShow.length === 1) {
    rows = matchingCountry
  } else {
    rows = matching10Countries
  }

  const Weather = (props) => {

    console.log('weather props', props)

    if (countriesToShow.length === 1)
    return (
      <div>
        <p><b>Temperature:</b> {props.main.temp} Fahrenheit</p>
        {props.weather.map(w => (
          <p><b>Skies:</b> {w.description} <img src={`http://openweathermap.org/img/w/${w.icon}.png`}alt="Weather Icon"/></p>
        ))}
        <p><b>Wind:</b> {props.wind.speed} {props.wind.direction}</p>
      </div>
    )
    return null
  }

  const weatherHook = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b548fb7745903d5c6f4d57c11d5f2b19&units=imperial `)
      .then(response => {
        console.log('weather response', response)
        setShowWeather(response.data)
      })
  }

  useEffect(weatherHook, [])

  console.log("rows", rows)

return (
  <div>
    <h2>Country Finder</h2>
    <form>
      Enter country: <input
        value={newFilter}
        onChange={handleFilterChange}/>
    </form>
    <div>
      {rows()}
      <Weather
        visibility={showWeather.visibility}
        main={showWeather.main}
        weather={showWeather.weather}
        wind={showWeather.wind}
        coord={showWeather.coord}
        />
    </div>
  </div>
  )
}

export default App
