
//App.jsx
import { useState } from 'react'
import './App.css'

import CountryDetails from './components/CountryDetails'
import useCountry from './hooks/useCountry'

const App = () => {
  const [search, setSearch] = useState('')
  const { country, loading, error } = useCountry(search)
  //console.log(country)

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  return (
    <div>
      <h1>Countries</h1>
      <input
        placeholder="Enter Country"
        value={search}
        onChange={handleChangeSearch}
      />

      {loading && <p>Loading country details...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {country && <CountryDetails country={country} />}
    </div>
  )
}

export default App
