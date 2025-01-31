//hooks/useCountry.js

import { useState, useEffect } from 'react'
import axios from 'axios'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!name) return

    setLoading(true)
    setError(null)

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry(response.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Country not found')
        setCountry(null)
        setLoading(false)
      })
  }, [name]) 

  return { country, loading, error }
}

export default useCountry
