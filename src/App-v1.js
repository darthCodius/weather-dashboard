import { useState } from "react";
const _ = require("lodash");

const API_KEY = "4881c56861c7fc6e33f556e4f8bd0234";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState("");

  async function handleClick() {
    if (!query) return;

    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `${BASE_URL}q=${query}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("Something Went Wrong! Invalid City Name!");

      const data = await res.json();

      console.log(data);
      setWeatherData(data);
      setIsLoading(false);
      setError("");
      setQuery("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} onClick={handleClick} />
      </Navbar>

      <Main>
        <Box>
          {!_.isEmpty(weatherData) && !isLoading && !error && (
            <WeatherDetails weatherData={weatherData} />
          )}
          {error && <ErrorMessage message={error} />}
          {isLoading && <Loader />}
        </Box>
      </Main>
    </>
  );
}

function Search({ query, setQuery, onClick }) {
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search City..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn-add" onClick={onClick}>
        Search
      </button>
    </>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function WeatherDetails({ weatherData }) {
  const { main, wind, name } = weatherData;

  return (
    <>
      <div className="details">
        <h3>City Name : {name}</h3>
        <p>Temperature : {main.feels_like} 🌡</p>
        <p>Humidity : {main.humidity} 💧</p>
        <p>Wind Speed : {wind.speed} 💨</p>
      </div>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
