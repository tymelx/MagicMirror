angular.module("dashboard", []).controller("dashboardCtrl", ["$scope", "$interval", "$timeout", "$http", function($scope, $interval, $timeout, $http) {
    $scope.currentTime = null;
    $scope.currentTimeInterval = null;
    
    createCurrentTime();
    function createCurrentTime() {
        $scope.currentTimeInterval = $interval(function() {
            $scope.currentTime = moment().format("hh:mm:ss A");
        }, 1000)
    }
    
    $scope.currentWeather = null;
    
    createCurrentWeather();
    _getWeather();
    function createCurrentWeather() {
        $timeout(_getWeather, 300000);
    }
    
    function _getWeather() {
        $scope.isGettingWeather = true;
        $http.get("/weather").success(function(weather) {
            $scope.isGettingWeather = false;
            $scope.currentWeather = weather;
        }).error(function(err) {
            //Ahh... oh well
        })
    }
}])