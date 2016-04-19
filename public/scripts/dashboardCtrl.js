angular.module("dashboard", []).controller("dashboardCtrl", ["$scope", "$interval", function($scope, $interval) {
    $scope.currentTime = null;
    $scope.currentTimeInterval = null;
    
    createCurrentTime();
    
    function createCurrentTime() {
        $scope.currentTimeInterval = $interval(function() {
            $scope.currentTime = moment().format("hh:mm:ss A");
        }, 1000)
    }
}])