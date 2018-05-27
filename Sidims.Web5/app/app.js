(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngCookies',
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'LocalStorageModule', // Angular Local Storage

        'ngPrint',

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        'oc.lazyLoad',

        // Added in v1.3
	    'FBAngular',

        // 3rd Party Modules
        'breeze.angular',    // configures breeze for an angular app
        'breeze.directives', // contains the breeze validation directive (zValidate)
        'ui.bootstrap'      // ui-bootstrap (ex: carousel, pagination, dialog)

    ]);

    // Handle routing errors and success events
    app.run(['$location', '$route', '$rootScope', '$q', 'breeze', 'routemediator', 'authService', 'localStorageService',
        function ($location, $route, $rootScope, $q, breeze, routemediator, authService, localStorageService) {
            // Include $route to kick start the router.

            routemediator.setRoutingHandlers();

            var authData = localStorageService.get('authorizationData');
            if (!authData) { $location.path('/login'); }

    }]);

    app.run(function () {
        // Page Loading Overlay
        public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

        jQuery(window).load(function () {
            public_vars.$pageLoadingOverlay.addClass('loaded');
        });
        
    });

    var serviceBase = 'http://localhost:53401/';
    var resourceBase = 'http://localhost:53401/';

    //var clientName = window.location.origin;
    //console.log(clientName);

    //if (clientName == 'http://localhost:55094') {
    //    var serviceBase = 'http://localhost:53401/';
    //    var resourceBase = 'http://localhost:53401/';

    //} else if (clientName == 'http://62.173.38.182') {
    //    var serviceBase = 'http://62.173.38.182/';
    //    var resourceBase = 'http://62.173.38.182/';
    //}

    app.constant('ngAuthSettings', {
        apiServiceBaseUri: serviceBase,
        apiResourceBaseUri: resourceBase,
        clientId: 'ngAuthApp3'
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);


    app.filter('sumOfValue',
        function() {
            return function(data, key) {
                if (angular.isUndefined(data) || angular.isUndefined(key))
                    return 0;
                var sum = 0;
                angular.forEach(data,
                    function(value) {
                        sum = sum + parseInt(value[key], 10);
                    });
                return sum;
            }
        });

  

})();