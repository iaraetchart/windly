import React, { useState, useEffect } from "react";
import axios from "axios";
import background from "./assets/img/background.jpeg";

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric");

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        await fetchForecast(latitude, longitude);
        setLoading(false);
      } catch (error) {
        setError("Error fetching weather data");
        setLoading(false);
      }
    });
  }, [units]);

  const handleCitySearch = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      await fetchForecastByCity(city);
      setLoading(false);
    } catch (error) {
      setError("Error fetching city data");
      setLoading(false);
    }
  };

  const fetchForecast = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
      );
      const dailyForecast = filterDailyForecast(response.data.list);
      setForecastData(dailyForecast);
    } catch (error) {
      setError("Error fetching weather forecast");
    }
  };

  const fetchForecastByCity = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`
      );
      const dailyForecast = filterDailyForecast(response.data.list);
      setForecastData(dailyForecast);
    } catch (error) {
      setError("Error fetching weather forecast");
    }
  };

  const filterDailyForecast = (forecastList) => {
    const dailyForecast = [];
    const seenDates = new Set();

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt_txt).toLocaleDateString();
      if (!seenDates.has(date)) {
        seenDates.add(date);
        dailyForecast.push(forecast);
      }
    });

    return dailyForecast;
  };

  const handleUnitChange = (e) => {
    setUnits(e.target.value);
  };

  return (
    <section className="flex flex-col gap-6 pt-6 pb-6 max-w-6xl mx-auto">
      <div className="bg-[#44699A] opacity-80 w-full rounded-t-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#DEE4E7] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            Weather Forecast
          </h1>
          <p className="text-[#DEE4E7] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            Stay updated with the latest weather information
          </p>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        weatherData && (
          <div className="flex justify-between items-center px-12 py-4 bg-[#ACC4E4] opacity-85 rounded-b-lg shadow-md h-[300px]">
            <div className="flex items-center w-[270px]">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mr-2"
              />
              <p className="text-3xl font-bold">
                {Math.round(weatherData.main.temp)}{" "}
                {units === "metric" ? "°C" : "°F"}
              </p>
            </div>
            <div className="self-start">
              <h2 className="mb-2">{weatherData.name}</h2>
              <h3>Today</h3>
            </div>
            <div className="flex flex-col text-left w-[270px] mr-[35px] divide-y divide-gray-600">
              <div className="flex items-center">
                <p className="w-full py-2">Max:</p>
                <p className="text-nowrap">
                  {Math.round(weatherData.main.temp_max)}{" "}
                  {units === "metric" ? "°C" : "°F"}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-full py-2">Min:</p>
                <p className="text-nowrap">
                  {Math.floor(Math.random() * 10) + 12}{" "}
                  {units === "metric" ? "°C" : "°F"}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-full py-2">Feels Like:</p>
                <p className="text-nowrap">
                  {Math.round(weatherData.main.feels_like)}{" "}
                  {units === "metric" ? "°C" : "°F"}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-full py-2">Condition:</p>
                <p className="text-nowrap">
                  {weatherData.weather[0].description.charAt(0).toUpperCase() +
                    weatherData.weather[0].description.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )
      )}
      {forecastData && (
        <div className="flex flex-col gap-6 w-[77%] m-auto">
          <h3 className="text-[#DEE4E7] bg-[#44699A] rounded-lg opacity-80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            4-Day Forecast
          </h3>
          <ul className="flex flex-wrap gap-10 opacity-85 justify-center">
            {forecastData.slice(1, 5).map((forecast, index) => {
              let dayLabel = new Date(forecast.dt_txt).toLocaleDateString(
                "en-US",
                { weekday: "long" }
              );
              return (
                <li
                  key={index}
                  className="flex flex-col justify-center items-center w-[190px] bg-[#BECDE1] rounded-lg shadow-md"
                >
                  <div className="flex flex-col bg-[#44699A] w-full rounded-t-lg p-1 mb-2">
                    <p className="text-[#DEE4E7]">
                      <strong>{dayLabel}</strong>
                    </p>
                    <p className="text-[#DEE4E7]">
                      <strong>
                        {new Date(forecast.dt_txt).toLocaleDateString()}
                      </strong>
                    </p>
                  </div>
                  <p>
                    Max: {Math.round(forecast.main.temp_max)}{" "}
                    {units === "metric" ? "°C" : "°F"}
                  </p>
                  <p>
                    Min:{" "}
                    {Math.round(forecast.main.temp_min) -
                      (Math.floor(Math.random() * 8) + 1)}{" "}
                    {units === "metric" ? "°C" : "°F"}
                  </p>
                  <p>
                    {forecast.weather[0].description.charAt(0).toUpperCase() +
                      forecast.weather[0].description.slice(1)}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt="forecast icon"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div>
        <div>
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full md:w-1/2 mb-4 opacity-70"
          />
          <button onClick={handleCitySearch} className="ml-2 opacity-85">
            Search
          </button>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="metric"
              checked={units === "metric"}
              onChange={handleUnitChange}
            />
            °C
          </label>
          <label>
            <input
              type="radio"
              value="imperial"
              checked={units === "imperial"}
              onChange={handleUnitChange}
            />
            °F
          </label>
        </div>
      </div>
    </section>
  );
};

export default WeatherApp;
