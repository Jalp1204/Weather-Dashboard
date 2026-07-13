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

async function getWeather(city) {

    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response=await fetch(url);
        const data=await response.json();

        if (data.cod != 200) {
            error.textContent = data.message;
            error.classList.remove("hidden");
            return;
        }

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

    } catch (error) {
    console.log(error);
    }

 
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        console.log("Please enter a city");
        return;
    }
    getWeather(city);

});