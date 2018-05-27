(function () {
    'use strict';
    var controllerId = 'ClientProduct';
    angular
        .module('app')
        .controller('ClientProduct', ClientProduct);

    ClientProduct.$inject = ['$location', '$routeParams', 'authService', 'common', 'datacontext', 'model', 'resourceService'];

    function ClientProduct($location, $routeParams, authService, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var auth = authService.authentication;

        vm.gotoJobDetails = gotoJobDetails;
        //vm.confirmReceipt = confirmReceipt;
        vm.jobs = [];
        vm.incomingJobs = [];

        activate();

        function activate() {
            var promises = [getProducts()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        //get client products

        function getProducts(forceRefresh) {
            return datacontext.clients.getProducts(auth.customerId, forceRefresh).then(function (data) {
                vm.products = data;
                console.log(vm.products);
                return vm.products;
            });
        }


        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/mis-report/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }


    }
})();
