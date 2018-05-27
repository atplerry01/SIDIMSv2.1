(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());


    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', 'ASSETS', routeConfigurator]);
    function routeConfigurator($routeProvider, routes, ASSETS) {

        routes.forEach(function (r) {
            //$routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });

        function setRoute(url, definition) {
            // Sets resolvers for all of the routes
            // by extending any existing resolvers (or creating a new one).
            definition.resolve = angular.extend(definition.resolve || {}, {
                prime: prime
            });
            $routeProvider.when(url, definition);
            return $routeProvider;
        }
    }

    prime.$inject = ['datacontext'];
    function prime(dc) { return dc.prime(); }

    getRoutes.$inject = ['$ocLazyLoad', 'ASSETS'];
    // Define the routes 
    function getRoutes($ocLazyLoad, ASSETS) {

        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/job/completed-job.html',
                    controller: 'CompletedJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pending-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/job/pending-job.html',
                    controller: 'PendingJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/completed-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/job/completed-job.html',
                    controller: 'CompletedJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/receiveables',
                config: {
                    title: 'Job',
                    templateUrl: 'app/product/receivable.html',
                    controller: 'Receivable',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/stock-reports',
                config: {
                    title: 'Job',
                    templateUrl: 'app/product/stockreport.html',
                    controller: 'StockReport',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/dispatch-notes',
                config: {
                    title: 'Job',
                    templateUrl: 'app/inventory/dispatchnote.html',
                    controller: 'DispatchNote',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/dispatch-notes/:id',
                config: {
                    title: 'Job',
                    templateUrl: 'app/inventory/deliverynotedetail.html',
                    controller: 'DeliveryNoteDetail',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/mis-reports',
                config: {
                    title: 'Job',
                    templateUrl: 'app/inventory/client-product.html',
                    controller: 'ClientProduct',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/mis-report/:id',
                config: {
                    title: 'Job',
                    templateUrl: 'app/inventory/misstockreports.html',
                    controller: 'MISStockReport',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/login',
                config: {
                    title: 'Account Login',
                    templateUrl: 'app/login/login.html',
                    controller: 'login',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    },
                    resolve: {
                        resources: function ($ocLazyLoad, ASSETS) {
                            return $ocLazyLoad.load([
                                ASSETS.forms.jQueryValidate,
                                ASSETS.extra.toastr,
                            ]);
                        },
                    }
                }
            }
        ];
    }




})();