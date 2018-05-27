(function () {
    'use strict';
    var controllerId = 'DispatchNote';
    angular
        .module('app')
        .controller('DispatchNote', DispatchNote);

    DispatchNote.$inject = ['$location', '$window', 'common', 'authService', 'datacontext'];

    function DispatchNote($location, $window, common, authService, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var auth = authService.authentication;

        vm.gotoJobDetails = gotoJobDetails;
        vm.deliveryreports = [];
        vm.incomingJobs = [];

        activate();

        function activate() {

            var promises = [getDispatchReports(), getProductionUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getDispatchReports(forceRefresh) {
            return datacontext.clients.getDeliveryReports(auth.customerId, forceRefresh).then(function (data) {
                vm.deliveryreports = data;
                console.log(vm.deliveryreports);
                return vm.deliveryreports;
            });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.clients.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                return vm.users;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('in/dispatch/delivery-report/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }


    }
})();
