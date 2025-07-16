const apikey='83587ff53f665013ee2b9a0fe239433b';
const defaultCity='jaleshwar';


function getWeather(){
    const city=document.getElementById('city').value|| defaultCity;

    if(!city){
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const forecastUrl=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    const phpUrl = `https://aayushshresthaweatherapp.wuaze.com?q=${city}`;
    const dbResult = fetch(phpUrl);

    fetch(currentWeatherUrl)
        .then(responce=>responce.json())
        .then(data=>{
            displayWeather(data);
        })
        .catch(error=>{
            console.error('Error fetching current weather data:',error);
            alert('Error fetching current weather data.PLease try again.');


        });

    
    fetch(forecastUrl)
        .then(responce=>responce.json())
        .then(data=>{
            displayHourlyForecast(data.list);

        })
        .catch(error=>{
            console.error('Error fetching hoourly forexast data:',error);
            alert('Error fetching hourly forecast data.PLease try again.');
        });

}
function displayWeather(data){
    const tempDivInfo=document.getElementById('temp-div');
    const weatherInfoDiv=document.getElementById('weather-info');
    const weatherIcon=document.getElementById('weather-icon');
    const hourlyForecastDiv=document.getElementById('hourly-forecast');

    //clear
    weatherInfoDiv.innerHTML='';
    hourlyForecastDiv.innerHTML='';
    tempDivInfo.innerHTML='';
    
    if(data.cod=='404'){
        weatherInfoDiv.innerHTML=`<p>${data.message}</p>`;
    }else{
        const cityName=data.name;
        const temperature=Math.round(data.main.temp-273.15);
        const description=data.weather[0].description;
        const iconCode=data.weather[0].icon;
        const iconUrl=`https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML=`
            <p>${temperature}°C</p>
        `;
        const weatherHTML=`
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML=temperatureHTML;
        weatherInfoDiv.innerHTML= weatherHTML;
        weatherIcon.src=iconUrl;
        weatherIcon.alt=description;
        showImage();
    }
}
function displayHourlyForecast(hourlyData){
    const hourlyForecastDiv=document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML='';
    const next24Hours=hourlyData.slice(0,8);

    next24Hours.forEach(item=>{
        const dataTime=new Date(item.dt*1000);
        const hour=dataTime.getHours();
        const temperature=Math.round(item.main.temp-273.15);
        const iconCode=item.weather[0].icon;
        const iconUrl=`https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTMl=`
        <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
        </div>
        `;
        
        hourlyForecastDiv.innerHTML+=hourlyItemHTMl;
    });
}
function showImage(){
    const weatherIcon =document.getElementById('weather-icon');
    weatherIcon.style.display='block';

}
document.addEventListener('DOMContentLoaded',()=>{
    getWeather();
});