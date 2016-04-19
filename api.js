var weatherService = require("./core/services/weatherService");

module.exports = function(app) {
    app.get("/weather", function(req, res) {
        weatherService.getWeather(function(data) {
           res.send(data);
        })
    });
}