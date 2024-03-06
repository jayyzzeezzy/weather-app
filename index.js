const form = document.querySelector('form');
const submitBtn = document.querySelector('.submit-button');
const error = document.querySelector('.error-msg');
form.addEventListener('submit', handleSubmit);
submitBtn.addEventListener('click', handleSubmit)

function handleSubmit(e) {
    e.preventDefault();
    queryCityWeather();
};

async function fetchWeather(location) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=6dffe647253f40079f565007242702&q=${location}`, {mode: 'cors'});

    if (response.status === 400) {
        throwError();
    }
    else {
        error.style.display = 'none';
        const weatherData = await response.json();
        const data = processAPI(weatherData);
        displayWeather(data);
        resetForm();
    }
};

function throwError() {
    error.style.display = 'block';
};

function processAPI(data) {
    const myData = {
        city: data.location.name.toUpperCase(),
        condition: data.current.condition.text,
        currentTemp: {
            f: Math.round(data.current.temp_f),
            c: Math.round(data.current.temp_c)
        },
        feelsLike: {
            f: Math.round(data.current.feelslike_f),
            c: Math.round(data.current.feelslike_c)
        },
        wind: Math.round(data.current.wind_mph),
        humidity: data.current.humidity,
    }

    if (data.location.country === "United States of America") {
        myData['region'] = data.location.region.toUpperCase();
    }
    else {
        myData['region'] = data.location.country.toUpperCase();
    }

    return myData;
};

function displayWeather(weatherData) {
    const city = document.querySelector('.city');
    const condition = document.querySelector('.condition');
    const temp = document.querySelector('.temp');
    const feelsLike = document.querySelector('.feels-like');
    const wind = document.querySelector('.wind');
    const humidity = document.querySelector('.humidity');

    city.textContent = `${weatherData.city}, ${weatherData.region} `;
    condition.textContent = weatherData.condition.toUpperCase();
    temp.textContent = weatherData.currentTemp.f;
    feelsLike.textContent = `FEELS LIKE: ${weatherData.feelsLike.f}`;
    wind.textContent = `WIND: ${weatherData.wind} MPH`;
    humidity.textContent = `HUMIDITY: ${weatherData.humidity}%`;
};

function resetForm() {
    form.reset();
};

function queryCityWeather() {
    const input = document.querySelector('#user-input');
    fetchWeather(input.value);
};

fetchWeather('san francisco, CA');