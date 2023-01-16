import { useState, useEffect } from "react";
import axios from "axios";

// Komponentti, joka hoitaa verkkosivun renderöinnin jos hakutuloksia on > 1
const Countries = ({ filteredCountries, newFilter }) => {
    if (filteredCountries.length > 10 && newFilter.length > 0) {
      return (
        <div style={{ color: "red" }}>Too many matches, specify your search</div>
      );
    } else if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
      return (
        <>
          {filteredCountries.map((country) => (
            <p key={country.name.official}>{country.name.common}</p>
          ))}
        </>
      );
    } else if (filteredCountries.length === 1) {
      return (
        <div>
          <SearchedCountry filteredCountries={filteredCountries} />
        </div>
      );
    }
  };

  // Komponentti, joka hoitaa verkkosivun renderöinnin haetun maan tiedoilla
  // Propsina tieto haetusta maasta
  const SearchedCountry = ({ filteredCountries }) => {
    const [weather, setWeather] = useState();
    let lat = filteredCountries[0].latlng[0];  // Haetaan tieto ko. maan koordinaateista
    let lon = filteredCountries[0].latlng[1];
    const api_key = process.env.REACT_APP_API_KEY;  // Haetaan react dev-serverin käynnistyksessa annettu API-key säätietojen hakua varten
    // Sijoitetaan koordinaatit ja API-key url:iin
    let weatherAPIurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    
    //
    useEffect(() => {
      axios.get(weatherAPIurl).then((response) => {
        setWeather(response.data);
      });
    }, [weatherAPIurl]);
    
    if (!weather || filteredCountries >= 2) {
      return null;
    } else {
      return (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital city: {filteredCountries[0].capital}</p>
          <p>Surface area: {filteredCountries[0].area}</p>
          <h4>Languages:</h4>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language) => (
              <li key={language + filteredCountries.length}>{language}</li>
            ))}
          </ul>
          <img
            style={{ border: "1px solid" }}
            src={filteredCountries[0].flags.png}
            alt={`${filteredCountries[0].name.common}'s flag'`}
          ></img>
          <h4>Weather in {filteredCountries[0].name.common}</h4>
          <p>
            Temperature: {(weather.main.temp - 273.15).toFixed(1)} degrees Celsius
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`${weather.weather[0].description} icon`}
          ></img>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      );
    }
  };

  export default Countries;