import { useState, useEffect } from "react";
import axios from "axios";  // Axios on promise-pohjainen HTTP-client Node.js:lle ja selaimelle
import Filter from "./components/Filter";
import Countries from "./components/Countries";

// Tämä on webbisovellus, jolla voi hakea tietoa eri maista
// Maiden tiedot saadaan https://restcountries.com
// Säätiedotteiden hakemiseen on käytetty https://openweathermap.org/ -> avaa siellä tili
// ja saat API-keyn
// Anna api-key kun starttaat React Developer Serverin terminaalista.
// Käytä (Powershell) komentoa: ($env:REACT_APP_API_KEY = "<secret_key_here>") -and (npm start)

const App = () => {

  // State-hookit tuovat tilan funktioina määriteltyihin React-komponetteihin
  const [countries, setCountries] = useState([]);  // Kaikkien maiden tiedot
  const [newFilter, setNewFilter] = useState("");  // Hakukentän operointi
  const [filteredCountries, setFilteredCountries] = useState([]);  // Käyttäjän hakemien maiden tiedot

  // Effect-hookin avulla haetaan maiden data palvelimelta (ja päivitetään tieto "state-muuttuja"-countries:iin
  // kutsumalla setCountriesia)
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  //  Event-listener hakukentälle, tieto käyttäjän inputeista päivitetään (newFilter) state-muuttujaan
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);

    // Filtteröidään kaikkien maiden joukosta (countries) käyttäjän hakukenttään kirjoittaman maan tiedot 
    // Ennen kuin haku on tarkentunut, filtteröityjä maita voi olla useita
    // Päivitetään filtteröidyt maat (filterdenCountries) state-muuttujaan
    if (event.target.value !== "") {
      const f_countries = countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
      setFilteredCountries(f_countries);
    }
  };

  // Välitetään propseina tietoa Filter- ja Countries-komponenteille
  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <Countries filteredCountries={filteredCountries} newFilter={newFilter} />
    </div>
  );
};

export default App;