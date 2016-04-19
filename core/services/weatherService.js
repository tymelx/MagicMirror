var appConfig = require("../../app.config");
var Forecast = require("forecast");

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
            callback(weather.currently);
        }
    })
}

module.exports = {
    getWeather: _getWeather
}