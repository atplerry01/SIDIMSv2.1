(function () {
    'use strict';
    var controllerId = 'CompletedJob';
    angular
        .module('app')
        .controller('CompletedJob', CompletedJob);

    CompletedJob.$inject = ['$location', '$window', 'authService', 'common', 'datacontext'];

    function CompletedJob($location, $window, authService, common, datacontext) {
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
            var promises = [getCompletedJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getCompletedJobs(forceRefresh) {
            return datacontext.clients.getCompletedJobs(auth.customerId, forceRefresh).then(function (data) {
                vm.incomingPersos = data;
                console.log(vm.incomingPersos);
                return vm.incomingPersos;
            });
        }

        function goBack() { $window.history.back(); }

    }
})();
