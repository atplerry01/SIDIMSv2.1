﻿(function () {
    'use strict';
    var controllerId = 'FirstCardPersoCE';
    angular
        .module('app')
        .controller('FirstCardPersoCE', FirstCardPersoCE);

    FirstCardPersoCE.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function FirstCardPersoCE($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        vm.addRow = addRow;
        vm.machineLists = [];

        vm.jobBatchTracker = undefined;
        vm.allIssuanceLogs = [];

        vm.issuanceLogs = [];
        vm.collectors = [];
        vm.job = undefined;
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;

        vm.errorMessage = '';
        $scope.message = "";
        vm.splitIsValid = false;

        activate();

        //Todo: Get List of Engineer

        function activate() {
            initLookups();

            var promises = [
                getRequestedJobTrackerById(),
                getJobs(),
                getJobTrackers(),
                getProductionUsers()
            ];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidMachines = lookups.sidMachines;

            angular.forEach(vm.sidMachines, function (todo, key) {
                if (todo.department.name == 'Card Engineer') {
                    vm.stateCheck = todo.name;
                    vm.machineLists.push(todo);
                }
            });
        }

        function getRequestedJobTrackerById() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    console.log(vm.jobTracker);
                    getClientVaultReport(vm.jobTracker.id);
                    getJobIssuanceLog(vm.jobTracker.id);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function getJobIssuanceLog(trackerId) {
            var val = trackerId;
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(val)
                .then(function (data) {
                    vm.issuanceLogs = data;
                    }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }

        function goBack() { $window.history.back(); }

        function save() {
            // get the the 
            var total = 0;
            angular.forEach($scope.inputs, function (todo, key) {
                var rangeQty = (todo.rangeTo - todo.rangeFrom) + 1;

                total += rangeQty;

                if (rangeQty > 0) {
                    vm.splitIsValid = true;
                    $scope.message = "";
                } else {
                    vm.splitIsValid = false;
                    $scope.message = "Invalid Range value detected";
                }
            });

            console.log(vm.issuanceLogs);
            console.log(vm.issuanceLogs[0].quantityIssued);

            if (vm.issuanceLogs[0].quantityIssued == total) {
                vm.splitIsValid = true;
                $scope.message = "";
            } else {
                vm.splitIsValid = false;
                $scope.message = "Invalid Range value detected";
            }
            
            if (vm.splitIsValid === false) {
                $scope.message = "Invalid Range value detected";
            } else {
                processSplitJob();
                $scope.message = "";
            }

        }

        function processSplitJob() {
            var newObject = [];

            // Compute the slit
            angular.forEach($scope.inputs, function (todo, key) {
                console.log(todo);
                var newObjectX = {
                    jobTrackerId: vm.jobTracker.id,
                    departmentId: todo.machine.departmentId,
                    sidMachineId: todo.machine.id,
                    rangeFrom: todo.rangeFrom,
                    rangeTo: todo.rangeTo,
                    jobBatchTrackerId: $routeParams.batchId
                };

                newObject.push(newObjectX);

            });

            createEntity(newObject);
        }

        function createEntity(entity) {
            console.log(entity);

            var resourceUri = model.resourceUri.ce + '/firstcard/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //vm.cardreceipt = {};
                $location.path('/ce/incoming-perso');
            },
             function (response) {
                 console.log(response);
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Failed to save resource due to:" + errors.join(' ');
             });
        }

        $scope.inputs = [{}];

        function addRow() {
            $scope.inputs.push({});
        }

        $scope.del = function (i) {
            $scope.inputs.splice(i, 1);
        }




        function getClientVaultReport(trackerId, forceRefresh) {
            var val = trackerId; //$routeParams.trackerId;
            console.log(val);
            return datacontext.inventory.getClientVaultReportByTrackerId(val, forceRefresh).then(function (data) {
                vm.clientVault = data;

                if (vm.clientVault.length == 0) {
                    vm.createVault = true;
                }
                console.log(vm.clientVault);
                return vm.clientVault;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                console.log(vm.jobTrackers);
                return vm.jobTrackers;
            });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                console.log(vm.users);
                return vm.users;
            });
        }

    }
})();
