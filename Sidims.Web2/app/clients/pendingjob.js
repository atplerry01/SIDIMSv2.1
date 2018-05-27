(function () {
    'use strict';
    var controllerId = 'PendingJob';

    angular
        .module('app')
        .controller('PendingJob', PendingJob);

    PendingJob.$inject = ['$location', '$route', '$rootScope', '$scope', 'authService', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function PendingJob($location, $route, $rootScope, $scope, authService, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingPersos = [];

        activate();

        function activate() {
            var promises = [getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingPersos(forceRefresh) {
            return datacontext.cardengrjob.getIncomingPersos(forceRefresh).then(function (data) {
                vm.incomingPersos = data;
                console.log(vm.incomingPersos);
                return vm.incomingPersos;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.clients.getPendingJobs(1, forceRefresh).then(function (data) {
                vm.jobs = data;
                console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('ce/first-card/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    }
})();
