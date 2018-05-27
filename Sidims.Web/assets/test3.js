(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngCookies',
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'LocalStorageModule', // Angular Local Storage
   
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
    app.run(['$route', '$rootScope', '$q', 'breeze', 'routemediator',
        function ($route, $rootScope, $q, breeze, routemediator) {
            // Include $route to kick start the router.

            routemediator.setRoutingHandlers();
    }]);


    app.run(function () {
        // Page Loading Overlay
        public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

        jQuery(window).load(function () {
            public_vars.$pageLoadingOverlay.addClass('loaded');
        })
    });

    app.directive('chosen', function () {
        var linker = function (scope, element, attr) {
           
            scope.$watch('accountTypes', function () {
                console.log(scope.accountTypes);
                element.trigger('liszt:updated');
            })

            element.chosen();
        }

        return {
            restrict: 'A',
            link: linker
        }
    })

    app.filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    });

    var serviceBase = 'http://localhost:64521/';
    var serviceBase1 = 'http://authorization.whycespace.com/';

    var resourceBase = 'http://localhost:64521/';
    var resourceBase1 = 'http://college-service.whycespace.com/';

    app.constant('ngAuthSettings', {
        apiServiceBaseUri: serviceBase,
        apiResourceBaseUri: resourceBase,
        clientId: 'ngAuthApp'
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);


    app.directive('currencyInput', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {

                return ctrl.$parsers.push(function (inputValue) {
                    var inputVal = element.val();

                    //clearing left side zeros
                    while (inputVal.charAt(0) == '0') {
                        inputVal = inputVal.substr(1);
                    }

                    inputVal = inputVal.replace(/[^\d.\',']/g, '');

                    var point = inputVal.indexOf(".");
                    if (point >= 0) {
                        inputVal = inputVal.slice(0, point + 3);
                    }

                    var decimalSplit = inputVal.split(".");
                    var intPart = decimalSplit[0];
                    var decPart = decimalSplit[1];

                    intPart = intPart.replace(/[^\d]/g, '');
                    if (intPart.length > 3) {
                        var intDiv = Math.floor(intPart.length / 3);
                        while (intDiv > 0) {
                            var lastComma = intPart.indexOf(",");
                            if (lastComma < 0) {
                                lastComma = intPart.length;
                            }

                            if (lastComma - 3 > 0) {
                                intPart = intPart.slice(0, lastComma - 3) + "," + intPart.slice(lastComma - 3);
                            }
                            intDiv--;
                        }
                    }

                    if (decPart === undefined) {
                        decPart = "";
                    }
                    else {
                        decPart = "." + decPart;
                    }
                    var res = intPart + decPart;

                    if (res != inputValue) {
                        ctrl.$setViewValue(res);
                        ctrl.$render();
                    }

                });

            }
        };
    });

    String.prototype.splice = function (idx, rem, s) {
        return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

})();