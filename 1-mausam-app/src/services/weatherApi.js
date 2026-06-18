const API_KEY = import.meta.env.VITE_API_KEY;

const WEATHER_BASE_URL =
    "https://api.openweathermap.org/data/2.5";

const GEO_BASE_URL =
    "https://api.openweathermap.org/geo/1.0";

/*
    Current Weather
*/
export async function fetchWeather(city) {
    const response = await fetch(
        `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(
            city
        )}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error("City not found.");
    }

    return response.json();
}

/*
    5-Day Forecast
*/
export async function fetchForecast(city) {
    const response = await fetch(
        `${WEATHER_BASE_URL}/forecast?q=${encodeURIComponent(
            city
        )}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to fetch forecast."
        );
    }

    const data = await response.json();

    /*
        Forecast comes every 3 hours.

        Pick only entries at 12 PM.
    */
    return data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
    );
}

/*
    Suggestions
*/
export async function fetchSuggestions(
    query
) {
    if (query.trim().length < 2) {
        return [];
    }

    const response = await fetch(
        `${GEO_BASE_URL}/direct?q=${encodeURIComponent(
            query
        )}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch suggestions."
        );
    }

    return response.json();
}