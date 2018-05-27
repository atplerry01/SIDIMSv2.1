(function () {
    'use strict';
    var controllerId = 'PrintDetailPR';
    angular
        .module('app')
        .controller('PrintDetailPR', PrintDetailPR);

    PrintDetailPR.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function PrintDetailPR($location, $routeParams, $scope, common, datacontext, model, resourceService) {
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

            var promises = [getRequestedJobByBatchId()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidMachines = lookups.sidMachines;

            angular.forEach(vm.sidMachines, function (todo, key) {
                if (todo.department.name == 'Printing') {
                    vm.stateCheck = todo.name;
                    vm.machineLists.push(todo);
                }
            });

            console.log(vm.machineLists);

        }

        $scope.inputs = [{}];

        function addRow() {
            $scope.inputs.push({});
        }

        $scope.del = function (i) {
            $scope.inputs.splice(i, 1);
        }


        function getRequestedJobByBatchId() {
            var val = $routeParams.batchId;
            return datacontext.resourcejob.getJobBatchTrackerById(val)
                .then(function (data) {
                    vm.jobBatchTracker = data;
                    console.log(vm.jobBatchTracker);
                    getJobIssuanceLog(vm.jobBatchTracker.jobTrackerId);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
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

            if (vm.jobBatchTracker.job.quantity == total) {
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
                    jobTrackerId: vm.jobBatchTracker.jobTrackerId,
                    departmentId: todo.machine.departmentId,
                    sidMachineId: todo.machine.id,
                    rangeFrom: todo.rangeFrom,
                    rangeTo: todo.rangeTo,
                    jobBatchTrackerId: $routeParams.batchId
                };

                newObject.push(newObjectX);

            });

            // push the slitJob
            createEntity(newObject);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.printing + '/printSplitCard/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                console.log(response);
                $location.path('/pr/incoming-print');
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

        //
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

        function getJobIssuanceLog(logId) {
            return datacontext.inventjob.getCardIssuanceLogs(logId)
                .then(function (data) {
                    vm.issuanceLogs = data;
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }

        function getAllJobIssuanceLog() {
            return datacontext.inventjob.getAllCardIssuanceLogs()
                .then(function (data) {
                    vm.allIssuanceLogs = data;
                    console.log(vm.allIssuanceLogs);
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                console.log(vm.users);
                return vm.users;
            });
        }



        // Navigation Request
        
        //function getCardEngrCollector(forceRefresh) {
        //    return datacontext.inventaccount.getCardEngrStaffs(forceRefresh).then(function (data) {
        //        vm.collectors = data;
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
        //    }

        //}

    
    }
})();
