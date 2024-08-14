const main = document.querySelector("main");

const cityEl = document.querySelector("#city");
const tempEl = document.querySelector("#temp");
const weatherEl = document.querySelector("#weather");
const img = document.querySelector("#weather-icon");

const speedWindEl = document.querySelector("#speedWind");
const humidityEl = document.querySelector("#humidity");
const pressureEl = document.querySelector("#pressure");

const btnSearch = document.querySelector("#search-btn");
const inpSearch = document.querySelector("#search-inp");
const searchContainer = document.querySelector("#search-container");
const weatherСontainer = document.querySelector("#weather-container");
const btnСhangeСity = document.querySelector("#btn-change-city");
const cityСontainer = document.querySelector("#city-container");
const changeCity = document.querySelector("#change-city");
const errorMess = document.querySelector("#error-mess");
const btnCloseError = document.querySelector("#btn-close-error");
const error = document.querySelector("#error");

class Weather {
  static async getWeather(city) {
    const ipKey = "82c8967d813a2c202c6cb6405b088f1d";
    const lang = "ru";
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ipKey}&units=${units}&lang=${lang}`;

    const respons = await fetch(url);

    if (respons.ok) {
      return respons.json();
    } else {
      return Promise.reject("Город не найден");
    }
  }

  static parceJSON(json) {
    return {
      city: json.name,
      temp: json.main.temp,
      weather: json.weather[0].description,
      icon: json.weather[0].icon,
      wind: json.wind.speed,
      humidity: json.main.humidity,
      pressure: json.main.pressure,
    };
  }

  static renderError(mess) {
    error.style.display = "flex";
    errorMess.textContent = mess;

    btnCloseError.addEventListener("click", () => {
      error.style.display = "none";
    });
  }

  static renderWeather() {
    Weather.getWeather(inpSearch.value)
      .then((json) => {
        const data = Weather.parceJSON(json);

        cityEl.textContent = data.city;
        tempEl.textContent = `${Math.floor(data.temp)}°`;
        weatherEl.textContent = ucFirst(data.weather);
        img.src = `images/${data.icon}.svg`;
        speedWindEl.textContent = `Скорость вертра: ${data.wind} м/с`;
        humidityEl.textContent = `Влажность: ${data.humidity}%`;
        pressureEl.textContent = `Давление: ${data.pressure} мм рт. ст`;

        cityСontainer.textContent = data.city;
        inpSearch.value = "";
        searchContainer.style.display = "none";
        weatherСontainer.style.display = "grid";
        error.style.display = "none";
        changeCity.style.display = "flex";
      })
      .catch((error) => {
        inpSearch.value = "";
        Weather.renderError(error);
      });
  }

  static changeCityMethod() {
    changeCity.style.display = "none";
    cityСontainer.textContent = "Не указано";
    searchContainer.style.display = "flex";
    weatherСontainer.style.display = "none";
  }
}

function ucFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}

btnSearch.addEventListener("click", () => {
  if (inpSearch.value != "") {
    Weather.renderWeather();
  } else {
    Weather.renderError("Пустое поле ввода");
  }
});

btnСhangeСity.addEventListener("click", () => Weather.changeCityMethod());
