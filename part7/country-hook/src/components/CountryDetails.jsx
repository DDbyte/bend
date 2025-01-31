
//components/C

const CountryDetails = ({ country }) => {


  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: <strong>{country.capital}</strong></p>
      <p>Area: {country.area}</p>
      <p><strong>Languages:</strong></p>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

    </div>
  )
}

export default CountryDetails