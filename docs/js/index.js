const API = {
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    key: 'c4422cf35f4cbed9fd9c8471c0432992'
};

const search = document.getElementById('submit');
const searchCity = document. getElementById('searchCity');

search.addEventListener('click', (event) => {
    let cityName = searchCity.value;
    event.preventDefault();
    
    fetch(`${API.baseUrl}?q=${cityName}&appid=${API.key}&units=metric`)
        .then(response => {
            return response.json();
        })
        .then(showReport);
});

function showReport(weatherData) {
    // Display city name and country
    let cityElement = document.getElementById('city');
    cityElement.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
    
    // Display temperature
    let tempElement = document.getElementById('main');
    tempElement.innerHTML = `${Math.round(weatherData.main. temp)} &deg;C`;
    
    // Display weather description
    let weatherTextElement = document.getElementById('weather-text');
    weatherTextElement. innerHTML = weatherData.weather[0]. main;
}
