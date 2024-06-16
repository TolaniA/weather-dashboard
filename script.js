document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const city = document.getElementById('city-input').value.trim();
    const url = `https://www.metaweather.com/api/location/search/?query=${city}`;
  
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then(locations => {
        if (locations.length === 0) {
          throw new Error('City not found');
        }
        const woeid = locations[0].woeid;
        return fetch(`https://www.metaweather.com/api/location/${woeid}/`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('City weather data not available');
        }
        return response.json();
      })
      .then(data => {
        const weather = data.consolidated_weather[0];
        document.getElementById('city-name').textContent = data.title;
        document.getElementById('temperature').textContent = `Temperature: ${weather.the_temp.toFixed(1)} °C`;
        document.getElementById('humidity').textContent = `Humidity: ${weather.humidity.toFixed(1)}%`;
        document.getElementById('weather-description').textContent = weather.weather_state_name;
        const iconUrl = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        document.getElementById('weather-icon').src = iconUrl;
  
        document.getElementById('weather-result').classList.remove('hidden');
        document.getElementById('error-message').classList.add('hidden');
      })
      .catch(error => {
        console.error(error);
        document.getElementById('weather-result').classList.add('hidden');
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').classList.remove('hidden');
      });
  });
  