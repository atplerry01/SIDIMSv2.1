(function () {
    'use strict';
    var controllerId = 'MISCreateProductIN';
    angular
        .module('app')
        .controller('MISCreateProductIN', MISCreateProductIN);

    MISCreateProductIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function MISCreateProductIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.goBack = goBack;
        vm.save = save;
        vm.selectedClientVariant = [];
        $scope.message = "";

        vm.cardTypes = [];
        vm.createVault = false;
        vm.productName = false;
        vm.card = {};
        vm.copyText = copyText;
        activate();

        //Todo: Get List of Engineer

        function copyText() {
            vm.card.productShortCode = vm.card.productName;
        }

        function activate() {

            initLookups();

            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated X JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidClients = lookups.clients;
            vm.cardTypes = lookups.sidCardTypes;

            var clientId = $routeParams.clientId;
            angular.forEach(vm.sidClients, function (todo, key) {
                if (todo.id == clientId) {
                    vm.client = todo;
                    vm.card.clientName = todo.name;
                }
            });
        }


        function save() {
            vm.newEntity = {
                sidClientId: vm.client.id,
                sidCardTypeId: vm.card.cardType.id,
                name: vm.card.productName,
                shortCode: vm.card.productShortCode,
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/product/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.card.productName = '';
                vm.card.productShortCode = '';
            },
			 function (response) {
			     $scope.message = "Failed to save due to: " + response.data.message;
			 });
        }


        //get ClientInfo










        //// Get Issuance Details
        //// Get MIS Report of the Client

        //function getRequestedJob() {
        //    var val = $routeParams.trackerId;
        //    return datacontext.resourcejob.getJobTrackerById(val)
        //        .then(function (data) {
        //            vm.jobTracker = data;
        //            console.log(vm.jobTracker);

        //            // get ProductId
        //            getProductVariant(vm.jobTracker.jobId);
        //            getJobs();

        //        }, function (error) {
        //            logError('Unable to get JobTracker ' + val);
        //        });
        //}

        //function getProductVariant(jobId, forceRefresh) {
        //    return datacontext.resourcejob.getJobVariantByJobId(jobId, forceRefresh).then(function (data) {
        //        console.log(data);
        //        if (data.length !== 0) {
        //            vm.jobVariants = data[0];
        //            console.log(vm.jobVariants);
        //            vm.productName = true;
        //        }
              
        //        return vm.jobVariants;
        //    });
        //}
   
        //function getClientVaultReport(forceRefresh) {
        //    var val = $routeParams.trackerId;
        //    console.log(val);
        //    return datacontext.inventory.getClientVaultReportByTrackerId(val, forceRefresh).then(function (data) {
        //        vm.clientVault = data;

        //        if (vm.clientVault.length == 0) {
        //            vm.createVault = true;
        //        }
        //        console.log(vm.clientVault);
        //        return vm.clientVault;
        //    });
        //}

        function goBack() { $window.history.back(); }

        //function createProductVault() {
        //    vm.newVault = {
        //        sidProductId: vm.jobVariants.sidProductId,
        //        openingStock: 0,
        //        closingStock: 0
        //    };

        //    console.log(vm.newVault);

        //    var resourceUri = model.resourceUri.inventory + '/ClientVault/create';
        //    resourceService.saveResource(resourceUri, vm.newVault).then(function (response) {
        //        getClientVaultReport();
        //        vm.createVault = false;
        //    },
		//	 function (response) {
		//	     console.lo(response);
		//	     $scope.message = "Failed to save due to: "
        //             + response.data.message;
		//	 });

        //}

   

        //function getJobIssuanceLog() {
        //    var val = $routeParams.trackerId;
        //    return datacontext.inventjob.getCardIssuanceLogByTrackerId(val)
        //        .then(function (data) {
        //            vm.issuanceLogs = data;
        //        }, function (error) {
        //            logError('Unable to get CardIssuanceLog ' + val);
        //        });
        //}

        //function getJobs(forceRefresh) {
        //    return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
        //        vm.jobs = data;
        //        getReceiverAccount(vm.jobTracker.job.serviceType.name);
        //        return vm.jobs;
        //    });
        //}

        //function getCardEngrCollector(forceRefresh) {
        //    return datacontext.inventaccount.getCardEngrStaffs(forceRefresh).then(function (data) {
        //        vm.collectors = data;
        //        console.log(vm.collectors);
        //        return vm.collectors;
        //    });
        //}

        //function getProductionStaffCollector(forceRefresh) {
        //    return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
        //        vm.collectors = data;
        //        return vm.collectors;
        //    });
        //}

        //function getReceiverAccount(entity) {
        //    if (entity === 'Perso Only') {
        //        getCardEngrCollector();
        //    } else if (entity === 'Printing Only') {
        //        getProductionStaffCollector();
        //    } else if (entity === 'Mailing Only') {
        //        getProductionStaffCollector();
        //    } else if (entity === 'Printing And Perso') {
        //        getCardEngrCollector();
        //    } else {
        //        getProductionStaffCollector();
        //    }

        //}


    }


})();
