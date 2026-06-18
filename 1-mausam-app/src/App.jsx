import { useEffect, useState } from "react";
import Forecast from "./components/Forecast";
import RecentSearches from "./components/RecentSearches";
import SearchBar from "./components/SearchBar";
import Suggestions from "./components/Suggestions";
import WeatherCard from "./components/WeatherCard";
import useDebounce from "./hooks/useDebounce";
import useLocalStorage from "./hooks/useLocalStorage";
import useTheme from "./hooks/useTheme";
import {
  fetchForecast,
  fetchSuggestions,
  fetchWeather,
} from "./services/weatherApi";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage(
    "mausam-recent-searches",
    []
  );
  const debouncedCity = useDebounce(city, 500);

  useEffect(() => {
    let isCurrent = true;
    const trimmedCity = debouncedCity.trim();
    const currentCity = city.trim();

    if (currentCity.length < 2 || trimmedCity.length < 2 || loading) {
      return;
    }

    async function loadSuggestions() {
      try {
        setSuggestionsLoading(true);
        const data = await fetchSuggestions(trimmedCity);

        if (isCurrent) {
          setSuggestions(data);
          setActiveIndex(data.length ? 0 : -1);
        }
      } catch {
        if (isCurrent) {
          setSuggestions([]);
          setActiveIndex(-1);
        }
      } finally {
        if (isCurrent) {
          setSuggestionsLoading(false);
        }
      }
    }

    loadSuggestions();

    return () => {
      isCurrent = false;
    };
  }, [city, debouncedCity, loading]);

  async function handleSearch(searchTerm = city) {
    const trimmedCity = searchTerm.trim();

    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuggestions([]);
      setActiveIndex(-1);
      setSuggestionsLoading(false);

      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(trimmedCity),
        fetchForecast(trimmedCity),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      updateRecentSearches(weatherData.name || trimmedCity);
      setCity("");
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateRecentSearches(searchTerm) {
    setRecentSearches((searches) => {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const withoutDuplicate = searches.filter(
        (search) => search.toLowerCase() !== normalizedSearchTerm
      );

      return [searchTerm, ...withoutDuplicate].slice(0, 5);
    });
  }

  function handleCityChange(value) {
    setCity(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      setSuggestionsLoading(false);
    }
  }

  function handleInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((index) =>
        suggestions.length ? (index + 1) % suggestions.length : -1
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((index) =>
        suggestions.length
          ? (index - 1 + suggestions.length) % suggestions.length
          : -1
      );
      return;
    }

    if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (suggestions[activeIndex]) {
        handleSuggestionSelect(suggestions[activeIndex]);
        return;
      }

      handleSearch();
    }
  }

  function getSuggestionQuery(suggestion) {
    return [suggestion.name, suggestion.country]
      .filter(Boolean)
      .join(",");
  }

  function handleSuggestionSelect(suggestion) {
    const selectedCity = getSuggestionQuery(suggestion);

    setCity(selectedCity);
    setSuggestions([]);
    setActiveIndex(-1);
    handleSearch(selectedCity);
  }

  return (
    <main className="app-shell">
      <section className="dashboard">
        <div className="dashboard-header">
          <div className="top-bar">
            <p className="eyebrow">Mausam</p>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
          <h1>Weather Dashboard</h1>
          <p className="subtitle">
            Search any city for current conditions and a quick 5-day forecast.
          </p>
        </div>

        <div className="search-panel">
          <SearchBar
            city={city}
            setCity={handleCityChange}
            handleSearch={handleSearch}
            handleKeyDown={handleInputKeyDown}
            loading={loading}
          />

          <Suggestions
            suggestions={suggestions}
            activeIndex={activeIndex}
            onSelect={handleSuggestionSelect}
          />

          {suggestionsLoading && (
            <p className="suggestions-status">Finding matching cities...</p>
          )}
        </div>

        <RecentSearches searches={recentSearches} onSelect={handleSearch} />

        {error && <p className="error-message">{error}</p>}

        {loading && <p className="loading-message">Loading weather data...</p>}

        {!weather && !loading && !error && (
          <div className="empty-state">
            <p>Try Mumbai, London, Tokyo, or New York.</p>
          </div>
        )}

        <WeatherCard weather={weather} />
        <Forecast forecast={forecast} />
      </section>
    </main>
  );
}

export default App;
