const apiKey = 'ce74a593068c612e5bc8451997f2fb81';

/* -------------------- Get data from local storage  -------------------- */

let locationArr = [];
let weatherArr = [];
let lastUpdate = 0;

if (localStorage.getItem('myWeatherLocationArr')) {
    locationArr = JSON.parse(localStorage.getItem('myWeatherLocationArr'));
} else {
    localStorage.setItem('myWeatherLocationArr', JSON.stringify(locationArr));
}

if (localStorage.getItem('myWeatherWeatherArr')) {
    weatherArr = JSON.parse(localStorage.getItem('myWeatherWeatherArr'));
} else {
    localStorage.setItem('myWeatherWeatherArr', JSON.stringify(weatherArr));
}

if (localStorage.getItem('myWeatherLastUpdate')) {
    lastUpdate = localStorage.getItem('myWeatherLastUpdate');
} else {
    localStorage.setItem('myWeatherLastUpdate', lastUpdate);
}

/* -------------------- Locations Settings Dialog  -------------------- */

const locationSettingsTemplate = document.querySelector('#settings-location-item');
const locationList = document.querySelector('#location-list');

function createLocationList() {
    document.querySelector('#location-list').innerHTML = '';

    for (let i = 0; i < locationArr.length; i++) {
        // create location items
        let locationSettingsItem = locationSettingsTemplate.cloneNode(true).content.querySelector('li');
        let locationName = locationSettingsItem.querySelector('.location-name');
        locationName.innerText = `${locationArr[i].name} (${locationArr[i].country})`;
        locationSettingsItem.setAttribute('data-location-lat', locationArr[i].lat);
        locationSettingsItem.setAttribute('data-location-lon', locationArr[i].lon);
        locationList.appendChild(locationSettingsItem);

        // Delete functionality/button
        locationSettingsItem.querySelector('button').addEventListener('click', function(e){
            // Remove from DOM
            e.currentTarget.parentNode.remove();
            // Remove from locationArr
            locationArr.splice(locationArr.indexOf(locationArr[i]));
            // Remove from weatherArr
            weatherArr.forEach(weatherItem => function (i) {
                if (weatherItem.lat === locationArr[i].lat && weatherItem.lon === locationArr[i].lon) {
                    weatherArr.splice(weatherArr.indexOf(weatherItem), 1);
                }
            });
        });
    }
}

createLocationList();

/* -------------------- Drag and Drop Loaction Settings  -------------------- */

let dragSrcEl = null;
let dragSrcLat = 0;
let dragSrcLon = 0;

let dragSrcIndex;
let dropSrcIndex;

function handleDragStart(e) {
    this.style.opacity = '0.4';
    
    dragSrcEl = e.currentTarget;
    dragSrcLat = e.currentTarget.getAttribute('data-location-lat');
    dragSrcLon = e.currentTarget.getAttribute('data-location-lon');

    for (let i = 0; i < locationArr.length; i++) {
        console.log(locationArr[i].lat, locationArr[i].lon);
        if (locationArr[i].lat == dragSrcLat && locationArr[i].lon == dragSrcLon) {
            dragSrcIndex = i;
        }
    }

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragSrcEl.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '.4';
}

function handleDragEnter(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '.4';
}

function handleDragLeave(e) {
    e.currentTarget.style.opacity = '1';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';

    for (let i = 0; i < locationArr.length; i++) {
        if (locationArr[i].lat == this.getAttribute('data-location-lat') && locationArr[i].lon == this.getAttribute('data-location-lon')) {
            dropSrcIndex = i;
        }
    }
    
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        dragSrcEl.setAttribute('data-location-lat', this.getAttribute('data-location-lat'));
        dragSrcEl.setAttribute('data-location-lon', this.getAttribute('data-location-lon'));

        this.innerHTML = e.dataTransfer.getData('text/html');
        this.setAttribute('data-location-lat', dragSrcLat);
        this.setAttribute('data-location-lon', dragSrcLon);
    }

    console.log(locationArr);

    let locationItemCopy1 = locationArr[dragSrcIndex];
    let locationItemCopy2 = locationArr[dropSrcIndex];
    console.log(dragSrcIndex);
    console.log(dropSrcIndex);
    

    locationArr[dragSrcIndex] = locationItemCopy2;
    locationArr[dropSrcIndex] = locationItemCopy1;
    
    console.log(locationArr);

    return false;
}

function handleDragEnd(e) {
    console.log('Drag end');
    this.style.opacity = '1';
}

let items = document.querySelectorAll('#location-list li[draggable=true]');
items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
});

/* -------------------- Search & Add Location Dialog  -------------------- */

const searchForm = document.querySelector('form#search-form');
const locationSearchResults = document.querySelector('ul#location-search-reults');
const locationSearchItem = document.querySelector('template#add-location-item').content.querySelector('li');
const searchInput = document.querySelector('input#search');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + '&limit=5&appid=' + apiKey)
        .then((response) => response.json())
        .then((locationData) => {
            console.log('Searchresults:');
            console.log(locationData);
            locationSearchResults.innerHTML = '';

            if (locationData.length === 0) {
                triggerToast('Error', 'Location not found.', 'error');
            } else {
                for (let i = 0; i < locationData.length; i++) {
                    // Creation of result list
                    locationSearchItemClone = locationSearchItem.cloneNode(true);
                    locationSearchItemClone.setAttribute('data-location', locationData[i].name);
                    locationSearchItemClone.querySelector('dt').innerText = `${locationData[i].name}`;
                    locationSearchItemClone.querySelector('dd').innerText = locationData[i].state ? `(${locationData[i].country} | ${locationData[i].state})` : `(${locationData[i].country})`;
                    locationSearchResults.appendChild(locationSearchItemClone);

                    // Adding locations
                    locationSearchItemClone.addEventListener('click', function () {
                        if (!locationArr.includes(locationData[i])) {
                            locationArr.push(locationData[i]);
                            createLocationList();
                            triggerToast('Info', 'Location added.', 'info');
                        } else {
                            triggerToast('Error', 'Location already exists.', 'error');
                        }
                    });
                }
            }
        })
});

/* -------------------- Open / Close Dialog  -------------------- */

const dialogButtons = document.querySelectorAll('button[data-dialog-target]');
const dialogs = document.querySelectorAll('.dialog');

dialogButtons.forEach(button => {
    button.addEventListener('click', function openDialog(e) {
        // toggle dialog
        let dialogTarget = document.getElementById(e.currentTarget.getAttribute('data-dialog-target'));
        dialogTarget.classList.add('open');

        // prevent backgound scrolling
        document.querySelector('body').style.overflow = 'hidden';

        // add background blur
        document.querySelector('header').style.filter = 'blur(8px)';
        document.querySelector('main').style.filter = 'blur(8px)';
    });
});

function closeDialog(e) {
    // Close dialog + enable scrolling + remove blur
    dialogs.forEach(dialog => dialog.classList.remove('open'))
    document.querySelector('body').style.overflow = 'auto';
    document.querySelector('header').removeAttribute('style');
    document.querySelector('main').removeAttribute('style');

    // Save array and rerender weather app only when things changed
    if (locationArr.length !== JSON.parse(localStorage.getItem('myWeatherLocationArr')).length) {
        localStorage.setItem('myWeatherLocationArr', JSON.stringify(locationArr));
        document.querySelector('main').innerHTML = '';
        getData(locationArr, 0);
    } else {
        for (let i = 0; i < locationArr.length; i++) {
            let locationArrItem = JSON.stringify(locationArr[i]);
            let localStorageArrItem = JSON.stringify(JSON.parse(localStorage.getItem('myWeatherLocationArr'))[i])

            if (locationArrItem !== localStorageArrItem) {
                localStorage.setItem('myWeatherLocationArr', JSON.stringify(locationArr));
                document.querySelector('main').innerHTML = '';
                getData(locationArr, 0);
            }
        }
    }
}

/* -------------------- Get Weather Data  -------------------- */

let weatherLocationName;

function getData(locationArr, counter) {
    // Set location name for headline
    weatherLocationName = locationArr[counter] ? locationArr[counter].name : null;
    console.log(weatherLocationName);

    // Get weather data
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + locationArr[counter].lat + '&lon=' + locationArr[counter].lon + '&appid=' + apiKey + '&units=metric&exclude=minutely')
    .then((response) => response.json())
    .then((weatherData) => {
        console.log(weatherData);
        let dataAdded = false;

        // Update lastUpdate value
        lastUpdate = weatherData.current.dt;
        localStorage.setItem('myWeatherLastUpdate', lastUpdate);

        // Add weather data if no data saved
        if (weatherArr.length === 0) {
            weatherArr.push(weatherData);
            dataAdded = true;
        } else {
            // Replace weather data if data for this location already exist
            for (let i = 0; i < weatherArr.length; i++) {
                if (weatherArr[i].lat === weatherData.lat && weatherArr[i].lon === weatherData.lon) {
                    weatherArr[i] = weatherData;
                    dataAdded = true;
                }
            }
        }

        if (dataAdded === false) {
            weatherArr.push(weatherData);
            dataAdded = true;
        }

        localStorage.setItem('myWeatherWeatherArr', JSON.stringify(weatherArr));

        // Set data in the app
        setWeatherData(weatherData);
        counter++;

        if (locationArr.length > counter) {
            getData(locationArr, counter);
        }
    });
}

getData(locationArr, 0);

/* -------------------- Enliven template with data  -------------------- */

function setWeatherData(weatherData) {
    // Clone template
    const weatherTemplate = document.querySelector('#weather-template');
    let weatherTemplateClone = weatherTemplate.cloneNode(true);

    // Set location name
    const weatherLocation = weatherTemplateClone.content.querySelector('.weather-location');
    weatherLocation.innerText = weatherLocationName;

    // Current weather video
    const currentWeatherVideo = weatherTemplateClone.content.querySelector('.current-weather-video > video');
    currentWeatherVideo.setAttribute('src', 'vid/' + setWeatherMedia(weatherData.current.weather[0], 'mp4') + '.mp4');

    // Current weather icon
    const currentWeatherIcon = weatherTemplateClone.content.querySelector('.current-weather-icon');
    currentWeatherIcon.setAttribute('src', 'images/icons/' + setWeatherMedia(weatherData.current.weather[0], 'svg') + '.svg');

    // Current Temp
    const currentTemperature = weatherTemplateClone.content.querySelector('.current-temperature-value');
    currentTemperature.innerText = Math.round(weatherData.current.temp);
    currentTemperature.parentNode.setAttribute('onclick', 'triggerToast("Now", "' + weatherData.current.weather[0].description + ' | ' + Math.round(weatherData.current.temp) + '°")');

    // Sun / Moon container
    const sunMoonContainer = weatherTemplateClone.content.querySelector('.sun-moon');
    sunMoonContainer.addEventListener('click', function(e){
        e.currentTarget.classList.toggle('flipped');
    });

    // Sunrise
    const currentSunrise = weatherTemplateClone.content.querySelector('.current-sunrise-value');
    currentSunrise.innerText = getHoursAndMinutes(weatherData.current.sunrise, weatherData.timezone_offset);

    // Sunposition
    let currentSunpositionValue = mapPercentageValue(weatherData.current.sunrise, weatherData.current.sunset, weatherData.current.dt);

    const currentSunpositionIndicator = weatherTemplateClone.content.querySelector('.current-sunposition-indicator');
    currentSunpositionIndicator.style.left = currentSunpositionValue + '%';
    currentSunpositionValue === 0 ? currentSunpositionIndicator.style.opacity = 0 : currentSunpositionIndicator.style.opacity = 1;

    const currentSunpositionProgress = weatherTemplateClone.content.querySelector('.current-sunposition-progress');
    currentSunpositionProgress.style.width = currentSunpositionValue + '%';

    // Sunset
    const currentSunset = weatherTemplateClone.content.querySelector('.current-sunset-value');
    currentSunset.innerText = getHoursAndMinutes(weatherData.current.sunset, weatherData.timezone_offset);

    // Moonrise
    const currentMoonrise = weatherTemplateClone.content.querySelector('.current-moonrise-value');
    currentMoonrise.innerText = getHoursAndMinutes(weatherData.daily[0].moonset, weatherData.timezone_offset);

    // Moonposition
    let currentMoonpositionValue = mapPercentageValue(weatherData.daily[0].moonrise, weatherData.daily[0].moonset, weatherData.current.dt);

    const currentMoonpositionIndicator = weatherTemplateClone.content.querySelector('.current-moonposition-indicator');
    currentMoonpositionIndicator.style.left = currentMoonpositionValue + '%';
    currentMoonpositionValue === 0 ? currentMoonpositionIndicator.style.opacity = 0 : currentMoonpositionIndicator.style.opacity = 1;

    const currentMoonpositionProgress = weatherTemplateClone.content.querySelector('.current-moonposition-progress');
    currentMoonpositionProgress.style.width = currentMoonpositionValue + '%';

    // Moonset
    const currentMoonset = weatherTemplateClone.content.querySelector('.current-moonset-value');
    currentMoonset.innerText = getHoursAndMinutes(weatherData.daily[0].moonrise, weatherData.timezone_offset);

    // Show Moon Widget, when useful
    currentSunpositionValue === 0 && currentMoonpositionValue !== 0 ? sunMoonContainer.classList.add('flipped') : null;

    // Wind Direction
    weatherTemplateClone.content.querySelector('#needle').style.transform = 'rotate(' + weatherData.current.wind_deg + 'deg)';

    const currentWindDirection = weatherTemplateClone.content.querySelector('.current-wind-direction-value');
    currentWindDirection.innerText = setWindDirection(weatherData.current.wind_deg, false);
    currentWindDirection.parentNode.setAttribute('onclick', 'triggerToast("Winddirection", "' + setWindDirection(weatherData.current.wind_deg, false) + ' | ' + setWindDirection(weatherData.current.wind_deg, true) + '")');

    // Wind Speed
    const currentWindSpeed = weatherTemplateClone.content.querySelector('.current-wind-speed-value');
    currentWindSpeed.innerText = Math.round(weatherData.current.wind_speed * 3.6);
    currentWindSpeed.parentNode.setAttribute('onclick', 'triggerToast("Windspeed", "' + Math.round(weatherData.current.wind_speed * 3.6) + ' km/h")');

    // Pressure
    const currentPressure = weatherTemplateClone.content.querySelector('.current-pressure-value');
    currentPressure.innerText = weatherData.current.pressure;
    currentPressure.parentNode.setAttribute('onclick', 'triggerToast("Pressure", "' + weatherData.current.pressure + ' hPa")');

    // Humidity
    const currentHumidity = weatherTemplateClone.content.querySelector('.current-humidity-value');
    currentHumidity.innerText = weatherData.current.humidity;
    currentHumidity.parentNode.setAttribute('onclick', 'triggerToast("Humidity", "' + weatherData.current.humidity + ' %")');

    // Propertiy of precipitation
    const currentPop = weatherTemplateClone.content.querySelector('.current-pop-value');
    currentPop.innerText = Math.round(weatherData.hourly[0].pop * 100);

    if (weatherData.hourly[0].rain) {
        let rainVolume = 1000 * 1000 * weatherData.hourly[0].rain["1h"] / 1000000;
        currentPop.parentNode.setAttribute('onclick', 'triggerToast("Rain", "' + Math.round(weatherData.hourly[0].pop * 100) + ' % | ' + rainVolume + ' l/m²")');
    } else if (weatherData.hourly[0].snow) {
        currentPop.parentNode.setAttribute('onclick', 'triggerToast("Snow", "' + Math.round(weatherData.hourly[0].pop * 100) + ' % | ' + weatherData.hourly[0].snow["1h"] + ' mm")');
    } else {
        currentPop.parentNode.setAttribute('onclick', 'triggerToast("Probability of precipitation", "' + Math.round(weatherData.hourly[0].pop * 100) + ' %")');
    }

    // UV Index
    const currentUvIndex = weatherTemplateClone.content.querySelector('.current-uvindex-value');
    currentUvIndex.innerText = weatherData.current.uvi;
    currentUvIndex.parentNode.setAttribute('onclick', 'triggerToast("UV Index", "' + weatherData.current.uvi + '")');

    // Set hourly weather data
    const hourlyWeatherList = weatherTemplateClone.content.querySelector('.hourly-weather-list');

    for (let i = 1; i < 25; i++) {
        const hourlyWeatherItem = weatherTemplateClone.content.querySelector('.hourly-weather-item');
        const hourlyWeatherItemClone = hourlyWeatherItem.cloneNode(true);

        // Hourly Weather Icon
        const hourlyWeatherIcon = hourlyWeatherItemClone.querySelector('.hourly-weather-item img');
        hourlyWeatherIcon.setAttribute('src', 'images/icons/' + setWeatherMedia(weatherData.hourly[i].weather[0], 'svg') + '.svg');

        // Hourly Temperature
        const hourlyTemperature = hourlyWeatherItemClone.querySelector('.hourly-temperature');
        hourlyTemperature.innerText = Math.round(weatherData.hourly[i].temp);

        // Time
        const hourlyTimestamp = hourlyWeatherItemClone.querySelector('.hourly-timestamp');
        hourlyTimestamp.innerText = getHoursAndMinutes(weatherData.hourly[i].dt, weatherData.timezone_offset)

        // Add toast
        let toastTitle = getHoursAndMinutes(weatherData.hourly[i].dt, weatherData.timezone_offset) // Time
        let toastDescription = weatherData.hourly[i].weather[0].description + ' | ' + Math.round(weatherData.hourly[i].temp) + '°'; // Weather description + temperature
        hourlyWeatherItemClone.setAttribute('onclick', 'triggerToast("' + toastTitle + '", "' + toastDescription + '")');

        // Add to template clone
        hourlyWeatherList.appendChild(hourlyWeatherItemClone, true);
    }

    // Set daily weather data
    const dailyWeatherList = weatherTemplateClone.content.querySelector('.daily-weather-list');

    for (let i = 1; i < 8; i++) {
        const dailyWeatherItem = weatherTemplateClone.content.querySelector('.daily-weather-item');
        const dailyWeatherItemClone = dailyWeatherItem.cloneNode(true);

        // Daily Day & Date
        const dailyDay = dailyWeatherItemClone.querySelector('.daily-day');
        const dailyDate = dailyWeatherItemClone.querySelector('.daily-date');
        dailyDay.innerText = getDay(weatherData.daily[i].dt, weatherData.timezone_offset);
        dailyDate.innerText = getDate(weatherData.daily[i].dt, weatherData.timezone_offset);

        // Daily Icon
        const dailyWeatherIcon = dailyWeatherItemClone.querySelector('.daily-weather-item img');
        dailyWeatherIcon.setAttribute('src', 'images/icons/' + setWeatherMedia(weatherData.daily[i].weather[0], 'svg') + '.svg');

        // Daily Temperature
        const dailyTemperature = dailyWeatherItemClone.querySelector('.daily-temperature');
        dailyTemperature.innerText = Math.round(weatherData.daily[i].temp.day);

        const dailyTemperatureMax = dailyWeatherItemClone.querySelector('.daily-temperature-max');
        dailyTemperatureMax.innerText = Math.round(weatherData.daily[i].temp.max);

        const dailyTemperatureMin = dailyWeatherItemClone.querySelector('.daily-temperature-min');
        dailyTemperatureMin.innerText = Math.round(weatherData.daily[i].temp.min);

        // POP
        const dailyPop = dailyWeatherItemClone.querySelector('.daily-pop');
        dailyPop.innerText = `${Math.round(weatherData.daily[i].pop * 100)} %`;
        
        // Wind
        const dailyWind = dailyWeatherItemClone.querySelector('.daily-wind');
        dailyWind.innerText = `${Math.round(weatherData.daily[i].wind_speed * 3.6)} km/h`;

        // Add toast
        let toastTitle = getDay(weatherData.daily[i].dt, weatherData.timezone_offset); // Day
        let toastDescription = weatherData.daily[i].weather[0].description + ' | ' + Math.round(weatherData.daily[i].temp.day) + '°'; // Weather description + temperature
        dailyWeatherItemClone.setAttribute('onclick', 'triggerToast("' + toastTitle + '", "' + toastDescription + '")');

        // Add to template clone
        dailyWeatherList.appendChild(dailyWeatherItemClone, true);
    }

    // Add weather alerts if avaiable
    if (weatherData.alerts) {
        // Weather alert template
        const alertTemplate = document.querySelector('#alert-template');
        let alertTemplateClone = alertTemplate.cloneNode(true);

        // Set alert value
        const alertValue = alertTemplateClone.content.querySelector('.alert-value');
        alertValue.innerText = weatherData.alerts[0].event;

        // Add clone to DOM
        weatherTemplateClone.content.querySelector('section.current-weather').insertBefore(alertTemplateClone.content.querySelector('.weather-alert'), weatherTemplateClone.content.querySelector('.current-weather-data'));
    }

    // Add clone to DOM
    document.querySelector('main').appendChild(weatherTemplateClone.content.querySelector('article'), true);
}

/* -------------------- Handle Toast  -------------------- */

function triggerToast(title, description, type = 'info') {
    // Clone template
    const toastTemplate = document.querySelector('#toast-template');
    let toastTemplateClone = toastTemplate.cloneNode(true).content.querySelector('.toast');

    // Set title or icon
    if (type === 'info') {
        toastTemplateClone.classList.add('info')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/info.svg" height="24" width="24" alt="Info icon" /> ' + title;
        toastTemplateClone.querySelector('dl dd').innerText = description;
    } else if (type === 'warning') {
        toastTemplateClone.classList.add('warning')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/warning.svg" height="24" width="24" alt="Warning icon" /> ' + title;
        toastTemplateClone.querySelector('dl dd').innerText = description;
    } else if (type === 'error') {
        toastTemplateClone.classList.add('error')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/error.svg" height="24" width="24" alt="Error icon" /> ' + title;
        toastTemplateClone.querySelector('dl dd').innerText = description;
    } else {
        toastTemplateClone.querySelector('.toast dl dt').innerText = title;
        toastTemplateClone.querySelector('dl dd').innerText = description;
    }

    // Add toast to body
    document.querySelector('body').appendChild(toastTemplateClone, true);

    setTimeout(function () {
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

function mapPercentageValue(min, max, value) {
    if (value <= max && value >= min) {
        return Math.round(100 / (max - min) * (value - min));
    } else {
        return 0;
    }
}

/* -------------------- Convert Icon Name -------------------- */

function setWeatherMedia(weather, filetype) {
    if (filetype === 'mp4'){
        let videoName = '';

        // clear sky
        if (weather.icon === '01d') {
            videoName = 'clear-sky-day';
        }
        if (weather.icon === '01n') {
            videoName = 'clear-sky-night';
        }

        // few clouds
        if (weather.icon === '02d') {
            videoName = 'few-clouds-day';
        }
        if (weather.icon === '02n') {
            videoName = 'few-clouds-night';
        }

        // scattered clouds
        if (weather.icon === '03d' || weather.icon === '03n') {
            videoName = 'cloud';
        }

        // broken clouds
        if (weather.icon === '04d' || weather.icon === '04n') {
            videoName = 'clouds';
        }

        // rain
        if (weather.icon === '09d' || weather.icon === '09n' || weather.icon === '10d' || weather.icon === '10n') {
            videoName = 'rain';
        }

        // thunderstorm
        if (weather.icon === '11d' || weather.icon === '11n') {
            videoName = 'thunderstorm';
        }

        // snow
        if (weather.icon === '13d' || weather.icon === '13n') {
            videoName = 'snow';
        }

        // mist
        if (weather.icon === '50d' || weather.icon === '50n') {
            videoName = 'mist';
        }

        return videoName;
    }

    if (filetype === 'svg'){
        let iconName = '';

        if (['01d', '01n', '02d', '02n'].includes(weather.icon)) {
            if (weather.icon === '01d') {
                iconName = 'clear-sky-day';
            }
    
            if (weather.icon === '01n') {
                iconName = 'clear-sky-night';
            }
    
            if (weather.icon === '02d') {
                iconName = 'few-clouds-day';
            }
    
            if (weather.icon === '02n') {
                iconName = 'few-clouds-night';
            }
        } else {
            // thunderstorm
            if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232].includes(weather.id)) {
                iconName = 'thunderstorm';
            }

            // drizzle
            if ([300, 301, 302, 310, 311, 312, 313, 314, 221].includes(weather.id)) {
                iconName = 'drizzle';
            }

            // light-rain
            if ([500, 501].includes(weather.id)) {
                iconName = 'light-rain';
            }

            // heavy-rain
            if ([502, 503, 504, 520, 521, 522, 531].includes(weather.id)) {
                iconName = 'light-rain';
            }

            // snow-rain
            if ([511, 615, 616, ].includes(weather.id)) {
                iconName = 'snow-rain';
            }

            // light-snow
            if ([600, 612, 620].includes(weather.id)) {
                iconName = 'light-snow';
            }

            // snow
            if ([601, 613, 621].includes(weather.id)) {
                iconName = 'snow';
            }

            // heavy-snow
            if ([602, 611, 622].includes(weather.id)) {
                iconName = 'heavy-snow';
            }

            // fog, mist
            if ([701, 721, 741].includes(weather.id)) {
                iconName = 'fog';
            }

            // smoke, dust
            if ([711, 731, 751, 761, 762].includes(weather.id)) {
                iconName = 'smoke';
            }

            // sqalls
            if ([771].includes(weather.id)) {
                iconName = 'wind';
            }

            // tornado
            if ([781].includes(weather.id)) {
                iconName = 'tornado';
            }

            // scattered clouds
            if (weather.id === 802) {
                iconName = 'cloud';
            }

            // broken clouds
            if ([803, 804].includes(weather.id)) {
                iconName = 'clouds';
            }
        }

        return iconName;
    }
}

/* -------------------- Convert Wind Direction -------------------- */

function setWindDirection(degrees, deg) {
    const step = 11.25;

    // North
    if ((degrees >= (0 - step) && degrees < (0 + step)) || degrees >= (360 - step)) {
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
