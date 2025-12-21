const API = {
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    key: 'c4422cf35f4cbed9fd9c8471c0432992'
};

const searchBtn = document.getElementById('submit');
const searchCity = document.getElementById('searchCity');

searchBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const cityName = (searchCity.value || '').trim();
    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    try {
        const url = `${API.baseUrl}?q=${encodeURIComponent(cityName)}&appid=${API.key}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            // OpenWeather sends { cod, message } on errors
            alert(data.message || 'Failed to fetch weather.');
            return;
        }

        showReport(data);
    } catch (err) {
        alert('Network error. Please try again.');
        console.error(err);
    }
});

function showReport(weatherData) {
    const cityElement = document.getElementById('city');
    cityElement.innerText = `${weatherData.name}, ${weatherData.sys?.country ?? ''}`.trim();

    // Use the 'temp' element id (ensure index.html matches)
    const tempElement = document.getElementById('temp');
    const t = weatherData.main?.temp;
    tempElement.innerHTML = (t != null) ? `${Math.round(t)} &deg;C` : '—';

    const weatherTextElement = document.getElementById('weather-text');
    weatherTextElement.innerHTML = weatherData.weather?.[0]?.main ?? '—';
}