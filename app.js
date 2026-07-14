const cityInput=document.getElementById("city-input");
const searchBtn=document.getElementById("search-btn");
const locationBtn=document.getElementById("location-btn");

const cityName=document.getElementById("city-name");
const date=document.getElementById("date");
const weatherIcon=document.getElementById("weather-icon");
const temperature=document.getElementById("temperature");
const description=document.getElementById("description");

const feelsLike=document.getElementById("feels-like");
const humidity=document.getElementById("humidity");
const windSpeed=document.getElementById("wind-speed");
const visibility=document.getElementById("visibility");

const loading=document.getElementById("loading");
const error=document.getElementById("error");

const forecastContainer=document.getElementById("forecast-container");

const BASE_URL="https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

function updateWeatherUI(data) {
    cityName.textContent=data.name;
    temperature.textContent=`${Math.round(data.main.temp)}°C`;
        
    const weatherDescription = data.weather[0].description;
    description.textContent =
    weatherDescription.charAt(0).toUpperCase() +
    weatherDescription.slice(1);

    const iconCode=data.weather[0].icon;
    weatherIcon.src=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    feelsLike.textContent=`${Math.round(data.main.feels_like)}°C`;
    humidity.textContent=`${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed)} m/s`;
    visibility.textContent = `${Math.round(data.visibility / 1000)} km`;

    const today=new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
        });
    date.textContent = formattedDate;

    error.classList.add("hidden");
}

async function getWeather(city) {
    searchBtn.disabled = true;
    loading.classList.remove("hidden");

    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response=await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        const data=await response.json();

        if (data.cod != 200) {
            error.textContent = data.message;
            error.classList.remove("hidden");
            return;
        }

        updateWeatherUI(data);
        getForecast(city);


    } catch (err) {
    console.error(err);
    error.textContent = "Failed to fetch weather data. Please try again.";
    error.classList.remove("hidden");
    }
    finally {
        searchBtn.disabled = false;
        loading.classList.add("hidden");
    }

 
}

function searchWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        error.textContent = "Please enter a city.";
        error.classList.remove("hidden");
        return;
    }

    getWeather(city);
}

searchBtn.addEventListener("click", () => {
    searchWeather();
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});

locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        error.textContent = "Geolocation is not supported by your browser.";
        error.classList.remove("hidden");
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        getWeatherByCoords(latitude, longitude);

    },(err) => {
        console.error(err);

        switch (err.code) {
            case 1:
                error.textContent = "Location permission denied.";
                break;
            case 2:
                error.textContent = "Unable to determine your location.";
                break;
            case 3:
                error.textContent = "Location request timed out.";
                break;
            default:
                error.textContent = "Failed to get your location.";
        }

        error.classList.remove("hidden");
    });
});

async function getWeatherByCoords(latitude, longitude) {
    searchBtn.disabled = true;
    loading.classList.remove("hidden");

    const url =
        `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();

        if (Number(data.cod) !== 200) {
            error.textContent = data.message;
            error.classList.remove("hidden");
            return;
        }

        updateWeatherUI(data);
        getForecastByCoords(latitude, longitude);

    } catch (err) {
        console.error(err);
        error.textContent = "Failed to fetch weather data. Please try again.";
        error.classList.remove("hidden");
    } finally {
        searchBtn.disabled = false;
        loading.classList.add("hidden");
    }
}

async function getForecast(city) {
    forecastContainer.innerHTML = "";
    const url = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();


        const forecastList = data.list.filter((item, index) => {
            return (index + 1) % 8 === 0;
        });


        forecastContainer.innerHTML = "";
        forecastList.forEach((day) => {
            const dayName = new Date(day.dt_txt).toLocaleDateString("en-IN", {
                weekday: "short",
            });

            const temp = Math.round(day.main.temp);

            const icon = day.weather[0].icon;

            const card = document.createElement("div");

            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
                <h3>${temp}°C</h3>
            `;

            forecastContainer.appendChild(card);

        });


        

    } catch (err) {
        console.error(err);
    }
}

async function getForecastByCoords(latitude, longitude) {
    forecastContainer.innerHTML = "";

    const url =
        `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();

        const forecastList = data.list.filter((item, index) => {
            return (index + 1) % 8 === 0;
        });

        forecastList.forEach((day) => {
            const dayName = new Date(day.dt_txt).toLocaleDateString("en-IN", {
                weekday: "short",
            });

            const temp = Math.round(day.main.temp);

            const icon = day.weather[0].icon;

            const card = document.createElement("div");

            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
                <h3>${temp}°C</h3>
            `;

            forecastContainer.appendChild(card);
        });

    } catch (err) {
        console.log(err);
        error.textContent = err.message;
        error.classList.remove("hidden");
    }
}