(function () {
    'use strict';
    var controllerId = 'MISStockReport';
    angular
        .module('app')
        .controller('MISStockReport', MISStockReport);

    MISStockReport.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISStockReport($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.products = [];
        vm.stockrepots = [];
        vm.gotoStockReportLog = gotoStockReportLog;

        activate();

        function activate() {
            var promises = [getClientStockReports()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getClientStockReports(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.clients.getClientStockReports(val, forceRefresh).then(function (data) {
                vm.stockrepots = data;
                console.log(vm.stockrepots);
                return vm.stockrepots;
            });
        }

        function gotoStockReportLog(entity) {
            getClientStockLogs(entity.id);
        }

        function getClientStockLogs(pred, forceRefresh) {
            return datacontext.clients.getClientStockLogByStockReportId(pred, forceRefresh).then(function (data) {
                vm.stockreportlogs = data;
                getClientIssuanceByStockLog(pred);
                getJobByCardIssuanceId(pred);
                return vm.stockreportlogs;
            });
        }

        function getClientIssuanceByStockLog(pred, forceRefresh) {
            return datacontext.clients.getCardIssuanceByStockLog(pred, forceRefresh).then(function (data) {
                vm.cardIssuance = data;
                return vm.cardIssuance;
            });
        }

        function getJobByCardIssuanceId(pred, forceRefresh) {
            return datacontext.clients.getJobByCardIssuanceId(pred, forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        //function getClientStockLogs(pred, forceRefresh) {
        //    console.log(pred);
        //    return datacontext.inventory.getClientStockLogByStockReportId(pred, forceRefresh).then(function (data) {
        //        vm.stockreportlogs = data;
        //        console.log(vm.stockreportlogs);
        //        getClientIssuanceByStockLog(vm.stockreportlogs.id);
        //        return vm.stockreportlogs;
        //    });
        //}

        //function getClientIssuanceByStockLog(pred, forceRefresh) {
        //    return datacontext.inventory.getCardIssuanceByStockLog(pred, forceRefresh).then(function (data) {
        //        vm.cardIssuance = data;
        //        console.log(vm.cardIssuance);
        //        return vm.cardIssuance;
        //    });
        //}


    }
})();
