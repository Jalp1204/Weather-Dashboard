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
    navigator.geolocation.getCurrentPosition((position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        getWeatherByCoords(latitude, longitude);

    },(err) => {
        console.log(err);
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

    } catch (err) {
        console.error(err);
        error.textContent = "Failed to fetch weather data. Please try again.";
        error.classList.remove("hidden");
    } finally {
        searchBtn.disabled = false;
        loading.classList.add("hidden");
    }
}