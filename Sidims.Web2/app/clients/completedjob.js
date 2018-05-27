(function () {
    'use strict';
    var controllerId = 'CompletedJob';

    angular
        .module('app')
        .controller('CompletedJob', CompletedJob);

    CompletedJob.$inject = ['$location', '$route', '$rootScope', '$scope', 'authService', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function CompletedJob($location, $route, $rootScope, $scope, authService, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingPersos = [];

        activate();

        function activate() {
            var promises = [getIncomingPersos(), getJobs()];
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
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
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
