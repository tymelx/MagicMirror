var appConfig = require("../../app.config");
var Forecast = require("forecast");
var moment = require('moment');

var forecast = new Forecast({
    service: "forecast.io",
    key: appConfig.weatherApiKey,
    units: "fahrenheit",
    cache: true,
    ttl: {
        minutes: 30,
        seconds: 0
    }
})

function _getWeather(callback) {
    forecast.get(appConfig.cityCoordinates, true, function(err, weather) {
        if (err) {
            console.log(err);
        } else {
            //Lets format this weather response!
            //We need the five day lookout day of week, temp, and summary
            //Along with the currently icon, temp, location, summary, wind, high and low
            var formattedWeather = {
                fiveDay: [],
                currently: {
                    icon: "",
                    location: appConfig.cityPrettyName,
                    summary: "",
                    windSpeed: 0,
                    high: 0,
                    low: 0
                }
            }
             
            if (weather.daily && weather.daily.data && weather.daily.data.length) {
                var currentDay = moment(weather.currently.time)
                
                for (var i = 0; i < 5; i++) {
                    var fiveDayInstance = {};
                    
                    var dailyInstance = weather.daily.data[i + 1];
                    fiveDayInstance.dayOfWeek = moment((dailyInstance.time * 1000)).format("dddd");
                    fiveDayInstance.temperature = Math.ceil(dailyInstance.temperatureMax);
                    fiveDayInstance.summary = dailyInstance.summary;
                    
                    formattedWeather["fiveDay"].push(fiveDayInstance)
                }
                
                //Have to get the current day high and low from this collection, lame
                formattedWeather.currently["high"] = Math.ceil(weather.daily.data[0].temperatureMax);
                formattedWeather.currently["low"] = Math.ceil(weather.daily.data[0].temperatureMin);
            }
            
            if (weather.currently) {
                formattedWeather.currently["icon"] = weather.currently.icon;
                formattedWeather.currently["temperature"] = Math.ceil(weather.currently.temperature);
                formattedWeather.currently["summary"] = weather.currently.summary;
                formattedWeather.currently["windSpeed"] = weather.currently.windSpeed;
                
            }

            callback(formattedWeather);
        }
    })
}

module.exports = {
    getWeather: _getWeather
}