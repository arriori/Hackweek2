﻿module.controller('AppController', function ($scope, $data, $localStorage, $http) {

    ons.ready(function () {
        if (($localStorage.credentials) && ($localStorage.token)) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;
            $scope.showPage("quickRoom");
        }
        else {
            $scope.loginmodal.show();

            setTimeout(function () {
                $scope.initBeaconMonitoring();
            }, 500);
        }
    });

    $scope.closeLoginModal = function () {

        $scope.loginmodal.hide();
        $scope.showPage("quickRoom");
    };

    $scope.startLoading = function () {
        $scope.loadingmodal.show();
    }

    $scope.endLoading = function () {
        $scope.loadingmodal.hide();
    }

    $scope.showPage = function (pageName) {
        $scope.tabbar.loadPage(pageName + '.html');
    };

   /* $rootScope.$on("CookieRefreshed", function () {
        $scope.showPage("discounts");
    });

    $rootScope.$on("InvalidLogin", function () {
        $scope.loginmodal.show();
    });
    */

    $scope.openLoginModal = function () {

        $scope.loginmodal.show();
     };
   
    $scope.initBeaconMonitoring = function () {
        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didDetermineStateForRegion = function (pluginResult) {
            $scope.text += '[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult);
            $scope.$apply();
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            $scope.text = 'didStartMonitoringForRegion: ' + pluginResult;
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            $scope.text += '[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult);
        };

        var region = $scope.createBeacon();

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        cordova.plugins.locationManager.requestWhenInUseAuthorization();
        // or cordova.plugins.locationManager.requestAlwaysAuthorization()

        cordova.plugins.locationManager.startMonitoringForRegion(region)
            .fail(console.error)
            .done();

        cordova.plugins.locationManager.startRangingBeaconsInRegion(region)
             .fail(console.error)
             .done();
    };

    $scope.createBeacon = function () {

        var uuid = 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825'; // mandatory
        var identifier = 'IG MVD'; // mandatory
        //  var minor = 1000; // optional, defaults to wildcard if left empty
        var major = 10004; // optional, defaults to wildcard if left empty

        // throws an error if the parameters are not valid
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major);

        return beaconRegion;
    }

});




