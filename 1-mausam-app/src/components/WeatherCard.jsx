function WeatherCard({ weather }) {
    if (!weather) {
        return null;
    }

    const {
        name,
        sys,
        main,
        weather: weatherInfo,
        wind,
    } = weather;

    const currentWeather = weatherInfo[0];

    return (
        <div className="weather-card">
            <h2 className="weather-city">
                {name}
                {sys?.country && `, ${sys.country}`}
            </h2>

            <div className="weather-main">
                <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                    alt={currentWeather.description}
                    className="weather-icon"
                />

                <div>
                    <h1 className="weather-temp">
                        {Math.round(main.temp)}&deg;C
                    </h1>

                    <p className="weather-description">
                        {currentWeather.description}
                    </p>
                </div>
            </div>

            <div className="weather-details">
                <div className="detail-item">
                    <span>Feels Like</span>
                    <strong>
                        {Math.round(main.feels_like)}&deg;C
                    </strong>
                </div>

                <div className="detail-item">
                    <span>Humidity</span>
                    <strong>{main.humidity}%</strong>
                </div>

                <div className="detail-item">
                    <span>Wind</span>
                    <strong>{wind.speed} m/s</strong>
                </div>

                <div className="detail-item">
                    <span>Pressure</span>
                    <strong>{main.pressure} hPa</strong>
                </div>
            </div>
        </div>
    );
}

export default WeatherCard;
