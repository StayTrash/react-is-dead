import formatDay from "../utils/formatDay";

function Forecast({ forecast }) {
    if (!forecast || forecast.length === 0) {
        return null;
    }

    return (
        <div className="forecast-section">
            <h2 className="forecast-title">5-Day Forecast</h2>

            <div className="forecast-grid">
                {forecast.map((day) => (
                    <div key={day.dt} className="forecast-card">
                        <p className="forecast-day">
                            {formatDay(day.dt_txt)}
                        </p>

                        <img
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                            alt={day.weather[0].description}
                            className="forecast-icon"
                        />

                        <p className="forecast-temp">
                            {Math.round(day.main.temp)}&deg;C
                        </p>

                        <p className="forecast-description">
                            {day.weather[0].description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Forecast;
