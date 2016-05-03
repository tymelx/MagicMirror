angular.module("dashboard", []).controller("dashboardCtrl", ["$scope", "$interval", "$timeout", "$http", "GoogleCalendar", function($scope, $interval, $timeout, $http, GoogleCalendar) {
    $scope.currentTime = null;
    $scope.currentTimeInterval = null;
    
    createCurrentTime();
    function createCurrentTime() {
        $scope.currentTime = moment().format("hh:mm A");
        $scope.currentDay = moment().format("dddd, MMM D")
        
        $scope.currentTimeInterval = $interval(function() {
            $scope.currentTime = moment().format("hh:mm A");
            $scope.currentDay = moment().format("dddd, MMM D")
        }, 60000)
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
            $scope.weather = weather;
        }).error(function(err) {
            //Ahh... oh well
        })
    }
    
    $scope.isGettingInitialGoogleStatus = true;
    $timeout(function() {
        GoogleCalendar.isAuthenticated(function(status) {
            $timeout(function() {
                $scope.isGettingInitialGoogleStatus = false;
                $scope.googleAuthStatus = status;
                
                if (status) {
                    _loadGoogleEvents();
                }
            });
        })
    }, 3000)
    
    
    $scope.authorizeGoogle = function() {
        GoogleCalendar.authenticate(function(status) {
            $scope.googleAuthStatus = status;
            
            if (status) {
                _loadGoogleEvents();
            }  
        })
    }
    
    function _loadGoogleEvents() {
        GoogleCalendar.loadCalendarEvents(function(events) {
            $timeout(function() {
                $scope.todaysEvents = events;
            });
        })
    }
}])