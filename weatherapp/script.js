/* -------------------- Locations  -------------------- */

// Get locations
let locationArray = [];

if(localStorage.getItem('myWeatherLocations')){
    locationArray = localStorage.getItem('myWeatherLocations').split(',');
} else {
    locationArray = ['Hamburg', 'New York'];
}

// Create location list
const locationTemplate = document.querySelector('#location-template');
const dropTemplate = document.querySelector('#drop-template');
const locationList = document.querySelector('#location-list');

function createLocationList() {
    document.querySelector('#location-list').innerHTML = '';

    let dropTemplateClone1 = dropTemplate.cloneNode(true);
    locationList.appendChild(dropTemplateClone1.content.querySelector('li'));

    locationArray.forEach(function(location){
        // create location clone
        let locationTemplateClone = locationTemplate.cloneNode(true);
        let locationTemplateItem = locationTemplateClone.content.querySelector('li');
        let locationName = locationTemplateClone.content.querySelector('.location-name');
        
        // set data
        locationName.innerText = location;
        locationTemplateItem.setAttribute('data-location', location);
        locationTemplateItem.setAttribute('id', location.replace(' ', '-'));

        // Add to list
        locationList.appendChild(locationTemplateItem);
    });

    let dropTemplateClone2 = dropTemplate.cloneNode(true);
    locationList.appendChild(dropTemplateClone2.content.querySelector('li'));
}

createLocationList();

// Add location
const searchInput = document.querySelector('#search');

function addLocation(e) {
    if (!locationArray.includes(searchInput.value)){
        fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + '&appid=476785f503861365fd3ce1fdd4c900c3')
        .then((response) => response.json())
        .then((locationData) => {
            if (Object.values(locationData[0].local_names).includes(searchInput.value)) {
                locationArray.push(searchInput.value);
                createLocationList();
            } else {
                alert('Location not found or already exists.');
            }
        })
    }
}

// Delete location
function deleteLocation(e) {
    locationArray.splice(locationArray.indexOf(e.getAttribute('data-location')), 1);
    e.parentNode.remove();  
}

// Open dialog

const settingsButton = document.querySelector('button#settings-button');
const settingsDialog = document.querySelector('dialog#settings-dialog');

settingsButton.addEventListener('click', function() {
    document.querySelector('body').style.overflow = 'hidden';
    settingsDialog.showModal();
});

// Close dialog

function closeDialog(e) {
    // Close dialog
    document.querySelector('body').style.overflow = 'auto';
    e.parentNode.close();

    // Save array and rerender weather app only when things changed
    if (locationArray.length !== localStorage.getItem('myWeatherLocations').split(',').length) {
        localStorage.setItem('myWeatherLocations', locationArray);
        refreshData();
    } else {
        for (let i = 0; i < locationArray.length; i++) {
            if (locationArray[i] !== localStorage.getItem('myWeatherLocations').split(',')[i]) {
                localStorage.setItem('myWeatherLocations', locationArray);
                refreshData();
            }
        }
    }
}

// Handle drag & drop

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");

    if (e.target === e.target.parentNode.firstElementChild) {
        e.target.after(document.getElementById(data));
    } else if (e.target === e.target.parentNode.lastElementChild) {
        locationList.insertBefore(document.getElementById(data), e.target);
    }

    let locations = document.querySelectorAll('li[data-location]');
    locationArray = [];

    locations.forEach(function(location) {
        location = location.getAttribute('data-location');
        locationArray.push(location);
    });
}

/* -------------------- API Requests  -------------------- */

let weatherLocationName;

function getData(locationArray, counter) {
    let location = locationArray[counter];
    console.log(location);
    location = location.replace(' ', '+');

    // Get location data
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + location + '&appid=476785f503861365fd3ce1fdd4c900c3')
    .then((response) => response.json())
    .then((locationData) => {
        console.log(locationData);

        // Get weather data
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + locationData[0].lat + '&lon=' + locationData[0].lon + '&appid=476785f503861365fd3ce1fdd4c900c3&units=metric&exclude=minutely')
            .then((response) => response.json())
            .then((weatherData) => {
                console.log(weatherData);
                weatherLocationName = locationData[0].name;
                setWeatherData(weatherData);
                counter++;
                if (locationArray.length > counter) {
                    getData(locationArray, counter);
                }
            });
    });
}

getData(locationArray, 0);

function refreshData() {
    document.querySelector('main').innerHTML = '';
    getData(locationArray, 0);
}

/* -------------------- Enliven template with data  -------------------- */

function setWeatherData(weatherData){
    // Clone template
    const weatherTemplate =  document.querySelector('#weather-template');
    let weatherTemplateClone = weatherTemplate.cloneNode(true);

    // Set location name
    const weatherLocation = weatherTemplateClone.content.querySelector('.weather-location');
    weatherLocation.innerText = weatherLocationName;

    // Current weather / Temp
    const currentWeatherIcon = weatherTemplateClone.content.querySelector('.current-weather-icon');
    const currentTemperature = weatherTemplateClone.content.querySelector('.current-temperature-value');

    currentWeatherIcon.setAttribute('src', '/images/illustrations/' + setWeatherIcon(weatherData.current.weather[0].icon) + '.png');
    currentTemperature.innerText = Math.round(weatherData.current.temp);
    currentTemperature.parentNode.setAttribute('title', 'Now - ' + weatherData.current.weather[0].description + ' ' + Math.round(weatherData.current.temp) + '°');
    
    // Sunrise
    const currentSunrise = weatherTemplateClone.content.querySelector('.current-sunrise-value');
    currentSunrise.innerText = getHoursAndMinutes(weatherData.current.sunrise, weatherData.timezone_offset);
    currentSunrise.parentNode.setAttribute('title', 'Sunrise - ' + getHoursAndMinutes(weatherData.current.sunrise, weatherData.timezone_offset));

    // Sunposition
    let currentSunpositionValue = getSunProgress(weatherData.current.sunrise, weatherData.current.sunset, weatherData.current.dt);

    const currentSunpositionIndicator = weatherTemplateClone.content.querySelector('.current-sunposition-indicator');
    currentSunpositionIndicator.style.left = currentSunpositionValue + '%';

    const currentSunpositionProgress = weatherTemplateClone.content.querySelector('.current-sunposition-progress');
    currentSunpositionProgress.style.width = currentSunpositionValue + '%';

    // Sunset
    const currentSunset = weatherTemplateClone.content.querySelector('.current-sunset-value');
    currentSunset.innerText = getHoursAndMinutes(weatherData.current.sunset, weatherData.timezone_offset);
    currentSunset.parentNode.setAttribute('title', 'Sunset - ' + getHoursAndMinutes(weatherData.current.sunset, weatherData.timezone_offset));

    // Wind Direction
    weatherTemplateClone.content.querySelector('#needle').style.transform = 'rotate(' + weatherData.current.wind_deg + 'deg)';

    const currentWindDirection = weatherTemplateClone.content.querySelector('.current-wind-direction-value');
    currentWindDirection.innerText = setWindDirection(weatherData.current.wind_deg, false);
    currentWindDirection.parentNode.setAttribute('title', 'Winddirection - ' + setWindDirection(weatherData.current.wind_deg, true));

    // Wind Speed
    const currentWindSpeed = weatherTemplateClone.content.querySelector('.current-wind-speed-value');
    currentWindSpeed.innerText = Math.round(weatherData.current.wind_speed * 3.6);
    currentWindSpeed.parentNode.setAttribute('title', 'Windspeed - ' + Math.round(weatherData.current.wind_speed  * 3.6) + ' km/h');

    // Pressure
    const currentPressure = weatherTemplateClone.content.querySelector('.current-pressure-value');
    currentPressure.innerText = weatherData.current.pressure;
    currentPressure.parentNode.setAttribute('title', 'Pressure - ' + weatherData.current.pressure + ' hPa');

    // Humidity
    const currentHumidity = weatherTemplateClone.content.querySelector('.current-humidity-value');
    currentHumidity.innerText = weatherData.current.humidity;
    currentHumidity.parentNode.setAttribute('title', 'Humidity - ' + weatherData.current.humidity + ' %');

    // Propertiy of 
    const currentPop = weatherTemplateClone.content.querySelector('.current-pop-value');
    currentPop.innerText = Math.round(weatherData.hourly[0].pop * 100);
    currentPop.parentNode.setAttribute('title', 'Probability of precipitation - ' + Math.round(weatherData.hourly[0].pop * 100) + ' %');

    // UV Index
    const currentUvIndex = weatherTemplateClone.content.querySelector('.current-uvindex-value');
    currentUvIndex.innerText = weatherData.current.uvi;
    currentUvIndex.parentNode.setAttribute('title', 'UV Index - ' + weatherData.current.uvi);

    // Set hourly weather data
    const hourlyWeatherList =  weatherTemplateClone.content.querySelector('.hourly-weather-list');

    for (let i = 1; i < 25; i++) {
        const hourlyWeatherItem = weatherTemplateClone.content.querySelector('.hourly-weather-item');
        const hourlyWeatherItemClone = hourlyWeatherItem.cloneNode(true);

        // Hourly Weather Icon
        const hourlyWeatherIcon = hourlyWeatherItemClone.querySelector('.hourly-weather-item img');
        hourlyWeatherIcon.setAttribute('src', '/images/icons/' + setWeatherIcon(weatherData.hourly[i].weather[0].icon) + '.svg');

        // Hourly Temperature
        const hourlyTemperature = hourlyWeatherItemClone.querySelector('.hourly-temperature');
        hourlyTemperature.innerText = Math.round(weatherData.hourly[i].temp);

        // Time
        const hourlyTimestamp = hourlyWeatherItemClone.querySelector('.hourly-timestamp');
        hourlyTimestamp.innerText = getHoursAndMinutes(weatherData.hourly[i].dt, weatherData.timezone_offset)

        // Set title 
        hourlyTimestamp.parentNode.setAttribute('title', getHoursAndMinutes(weatherData.hourly[i].dt, weatherData.timezone_offset) + ' - ' + weatherData.hourly[i].weather[0].description + ' | ' + Math.round(weatherData.hourly[i].temp) + '°');

        // Add to template clone
        hourlyWeatherList.appendChild(hourlyWeatherItemClone, true);
    }

    // Set daily weather data
    const dailyWeatherList =  weatherTemplateClone.content.querySelector('.daily-weather-list');

    for (let i = 1; i < 8; i++) {
        const dailyWeatherItem =  weatherTemplateClone.content.querySelector('.daily-weather-item');
        const dailyWeatherItemClone = dailyWeatherItem.cloneNode(true);

        // Daily Day & Date
        const dailyDay = dailyWeatherItemClone.querySelector('.daily-day');
        const dailyDate = dailyWeatherItemClone.querySelector('.daily-date');
        dailyDay.innerText = getDay(weatherData.daily[i].dt, weatherData.timezone_offset);
        dailyDate.innerText = getDate(weatherData.daily[i].dt, weatherData.timezone_offset);

        // Daily Icon
        const dailyWeatherIcon = dailyWeatherItemClone.querySelector('.daily-weather-item img');
        dailyWeatherIcon.setAttribute('src', '/images/icons/' + setWeatherIcon(weatherData.daily[i].weather[0].icon) + '.svg');

        // Daily Temperature
        const dailyTemperature = dailyWeatherItemClone.querySelector('.daily-temperature');
        dailyTemperature.innerText = Math.round(weatherData.daily[i].temp.day);

        const dailyTemperatureMax = dailyWeatherItemClone.querySelector('.daily-temperature-max');
        dailyTemperatureMax.innerText = Math.round(weatherData.daily[i].temp.max);

        const dailyTemperatureMin = dailyWeatherItemClone.querySelector('.daily-temperature-min');
        dailyTemperatureMin.innerText = Math.round(weatherData.daily[i].temp.min);

        // POP & Wind
        const dailyPop = dailyWeatherItemClone.querySelector('.daily-pop');
        dailyPop.innerText = Math.round(weatherData.daily[i].pop * 100);

        const dailyWind = dailyWeatherItemClone.querySelector('.daily-wind');
        dailyWind.innerText = Math.round(weatherData.daily[i].wind_speed * 3.6);

        // Set title 
        dailyWeatherIcon.parentNode.parentNode.setAttribute('title', getDay(weatherData.daily[i].dt, weatherData.timezone_offset) + ' - ' + weatherData.daily[i].weather[0].description + ' | ' + Math.round(weatherData.daily[i].temp.day) + '°');

        // Add to template clone
        dailyWeatherList.appendChild(dailyWeatherItemClone, true);
    }

    // Add clone to DOM
    document.querySelector('main').appendChild(weatherTemplateClone.content.querySelector('article'), true);
}

/* -------------------- Convert icon name -------------------- */

function setWeatherIcon(icon) {
    let iconName = '';

    // clear sky
    if (icon === '01d'){ 
        iconName = 'clear-sky-day';
    }
    if (icon === '01n') {
        iconName = 'clear-sky-night';
    }

    // few clouds
    if (icon === '02d') {
        iconName = 'few-clouds-day';
    }
    if (icon === '02n') {
        iconName = 'few-clouds-night';
    }

    // scattered clouds
    if (icon === '03d' || icon === '03n') {
        iconName = 'cloud';
    }

    // broken clouds
    if (icon === '04d' || icon === '04n') {
        iconName = 'clouds';
    }

    // rain
    if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n') {
        iconName = 'rain';
    }

    // thunderstorm
    if (icon === '11d' || icon === '11n') {
        iconName = 'thunderstorm';
    }

    // snow
    if (icon === '13d' || icon === '13n') {
        iconName = 'snow';
    }
    
    // mist
    if (icon === '50d' || icon === '50n') {
        iconName = 'mist';
    }

    return iconName;
}

/* -------------------- Convert wind direction -------------------- */

function setWindDirection(degrees, deg) {
    const step = 11.25;

    // North
    if ((degrees >= (0 - step) && degrees < (0 + step)) || degrees >= (360 - step)) {
        return deg ? degrees + '°' : 'N';
    }

    // North-North-East
    if (degrees > (22.5 - step) && degrees < (22.5 + step)) {
        return deg ? degrees + '°' : 'NNE';
    }

    // North-East
    if (degrees > (45 - step) && degrees < (45 + step)) {
        return deg ? degrees + '°' : 'NE';
    }

    // East-North-East
    if (degrees > (67.5 - step) && degrees < (67.5 + step)) {
        return deg ? degrees + '°' : 'ENE';
    }

    // East
    if (degrees > (90 - step) && degrees < (90 + step)) {
        return deg ? degrees + '°' : 'E';
    }

    // East-South-East
    if (degrees > (112.5 - step) && degrees < (112.5 + step)) {
        return deg ? degrees + '°' : 'ESE';
    }

    // South-East
    if (degrees > (135 - step) && degrees < (135 + step)) {
        return deg ? degrees + '°' : 'SE';
    }

    // South-South-East
    if (degrees > (157.5 - step) && degrees < (157.5 + step)) {
        return deg ? degrees + '°' : 'SSE';
    }

    // South
    if (degrees > (180 - step) && degrees < (180 + step)) {
        return deg ? degrees + '°' : 'S';
    }

    // South-South-West
    if (degrees > (202.5 - step) && degrees < (202.5 + step)) {
        return deg ? degrees + '°' : 'SSW';
    }

    // South-West
    if (degrees > (225 - step) && degrees < (225 + step)) {
        return deg ? degrees + '°' : 'SW';
    }

    // West-South-West
    if (degrees > (247.5 - step) && degrees < (247.5 + step)) {
        return deg ? degrees + '°' : 'WSW';
    }

    // West
    if (degrees > (270 - step) && degrees < (270 + step)) {
        return deg ? degrees + '°' : 'W';
    }

    // West-North-West
    if (degrees > (292.5 - step) && degrees < (292.5 + step)) {
        return deg ? degrees + '°' : 'WNW';
    }

    // North-West
    if (degrees > (315 - step) && degrees < (315 + step)) {
        return deg ? degrees + '°' : 'NW';
    }

    // North-North-West
    if (degrees > (337.5 - step) && degrees <= (337.5 + step)) {
        return deg ? degrees + '°' : 'NNW';
    }
}

/* -------------------- Toast  -------------------- */

const toastTemplate = document.querySelector('#toast-template');

function triggerToast(e){
    // Clone template
    let toastTemplateClone = toastTemplate.cloneNode(true);

    // Set title
    let title = e.getAttribute('title').split('-')[0].trim();
    toastTemplateClone.content.querySelector('.toast dl dt').innerText = title;

    // Set description
    let description = e.getAttribute('title').split('-')[1];
    toastTemplateClone.content.querySelector('.toast dl dd').innerText = description;

    // Add toast to body
    document.querySelector('body').appendChild(toastTemplateClone.content.querySelector('.toast'), true);

    setTimeout(function(){
        document.querySelector('.toast').remove();
    }, 3500);
};

/* -------------------- Helpers -------------------- */

function getHoursAndMinutes(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    hours = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
    mins = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
    return hours + ':' + mins;
}

function getDate(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate();

    let month = date.getUTCMonth() + 1
    month = month < 10 ? '0' + month : month;
    return day + '.' + month + '.';
}

function getDay(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    day = date.getUTCDay();
    
    switch (day) {
        case 1:
            return 'Mon.';
        case 2:
            return 'Tue.';
        case 3:
            return 'Wed.';
        case 4:
            return 'Thu.';
        case 5:
            return 'Fri.';
        case 6:
            return 'Sat.';
        case 0:
            return 'Sun.';
    }
}

function getSunProgress(min, max, value) {
    return Math.round(100 / (max - min) * (value - min));
}