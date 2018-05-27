(function () {
    'use strict';
    var controllerId = 'StockReport';
    angular
        .module('app')
        .controller('StockReport', StockReport);

    StockReport.$inject = ['$location', '$window', 'common', 'datacontext'];

    function StockReport($location, $window, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.goBack = goBack;
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
