(function () {
    'use strict';
    var controllerId = 'PendingJob';
    angular
        .module('app')
        .controller('PendingJob', PendingJob);

    PendingJob.$inject = ['$location', '$window', 'authService', 'common', 'datacontext'];

    function PendingJob($location, $window, authService, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var auth = authService.authentication;

        vm.jobs = [];
        vm.incomingPersos = [];
        vm.goBack = goBack;

        activate();

        function activate() {
            var promises = [getPendingJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }


        function getPendingJobs(forceRefresh) {
            return datacontext.clients.getPendingJobs(auth.customerId, forceRefresh).then(function (data) {
                vm.incomingPersos = data;
                console.log(vm.incomingPersos);
                return vm.incomingPersos;
            });
        }

        function goBack() { $window.history.back(); }

    }
})();
