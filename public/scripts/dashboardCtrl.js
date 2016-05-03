angular.module("dashboard", []).controller("dashboardCtrl", ["$scope", "$interval", "$timeout", "$http", "GoogleCalendar", function($scope, $interval, $timeout, $http, GoogleCalendar) {
    $scope.currentTime = null;
    $scope.currentTimeInterval = null;
    
    createCurrentTime();
    function createCurrentTime() {
        $scope.currentTime = moment().format("hh:mm A");
        $scope.currentDay = moment().format("dddd, MMM D")
        $scope.greeting = "Good " + getHumanizedTimeOfDay(moment()) + " Emily";

        $scope.currentTimeInterval = $interval(function() {
            $scope.currentTime = moment().format("hh:mm A");
            $scope.currentDay = moment().format("dddd, MMM D")
            $scope.greeting = "Good " + getHumanizedTimeOfDay(moment()) + " Emily";
        }, 60000)
    }
    
    function getHumanizedTimeOfDay(m) {
        var g = null; //return g
        if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
        
        var split_afternoon = 12 //24hr time to split the afternoon
        var split_evening = 17 //24hr time to split the evening
        var currentHour = parseFloat(m.format("HH"));
        
        if(currentHour >= split_afternoon && currentHour <= split_evening) {
            g = "Afternoon";
        } else if(currentHour >= split_evening) {
            g = "Evening";
        } else {
            g = "Morning";
        }
        
        return g;
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
    
    $http.get("/quotes").success(function(quotes) {
        $scope.currentQuote = 0;
        $scope.quotes = quotes;
        
        $interval(function() {
            if (($scope.currentQuote + 1) === quotes.length) {
                $scope.currentQuote = 0;
            } else {
                $scope.currentQuote++;
            }
        }, 86400000)
    })
}])