const apiKey = "0bd3fc6eef1cc50b75322d03a54e20d0";

function showLoader(show) {
    document.getElementById("loader").style.display = show ? "block" : "none";
}

function showWeather(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = `Temperature: ${data.main.temp} °C`;
    document.getElementById("desc").innerText = `Weather: ${data.weather[0].description}`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    getAQI(lat, lon);

    getForecast(data.name);
}

function getWeather() {
    const city = document.getElementById("city").value;
    if (city === "") {
        alert("Please enter city name");
        return;
    }

    showLoader(true);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            showLoader(false);
            if (data.cod !== 200) {
                alert("City not found");
                return;
            }
            showWeather(data);
        })
        .catch(() => {
            showLoader(false);
            alert("Error fetching data");
        });
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    showLoader(true);

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                showLoader(false);
                showWeather(data);
            });
    });
}

function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            const forecastDiv = document.getElementById("forecast");
            forecastDiv.innerHTML = "";

            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                forecastDiv.innerHTML += `
                    <p>
                        ${new Date(day.dt_txt).toDateString()} :
                        ${day.main.temp} °C
                    </p>
                `;
            }
        });
}
function getAQI(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            const aqiValue = data.list[0].main.aqi;
            let aqiText = "";

            switch (aqiValue) {
                case 1: aqiText = "Good 😊"; break;
                case 2: aqiText = "Fair 🙂"; break;
                case 3: aqiText = "Moderate 😐"; break;
                case 4: aqiText = "Poor 😷"; break;
                case 5: aqiText = "Very Poor ☠️"; break;
            }

            document.getElementById("aqi").innerText =
                `Air Quality Index: ${aqiText}`;
        });
}

