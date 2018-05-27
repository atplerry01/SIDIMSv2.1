(function () {
    'use strict';
    var controllerId = 'MISReport';
    angular
        .module('app')
        .controller('MISReport', MISReport);

    MISReport.$inject = ['$location', '$window', 'common', 'datacontext'];

    function MISReport($location, $window, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.jobs = [];
        vm.incomingPersos = [];
        vm.goBack = goBack;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }


        function goBack() { $window.history.back(); }

    }
})();
