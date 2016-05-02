var weatherService = require("./core/services/weatherService");
var appConfig = require("./app.config");

module.exports = function(app) {
    app.get("/weather", function(req, res) {
        weatherService.getWeather(function(data) {
           res.send(data);
        })
    });
    
    app.get("/googlecredentials", function(req, res) {
        res.send(appConfig.googleCalendarClientID);
    })
}