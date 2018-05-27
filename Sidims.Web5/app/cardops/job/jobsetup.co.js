(function () {
    'use strict';
    var controllerId = 'JobSetupCO';
    angular
        .module('app')
        .controller('JobSetupCO', JobSetupCO);

    JobSetupCO.$inject = ['$location', '$routeParams', '$scope', 'config', 'common', 'datacontext', 'model', 'resourceService'];

    function JobSetupCO($location, $routeParams, $scope, config, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
        //vm.gotoAddVariant = gotoAddVariant;

        //vm.serverJobs = [];
        vm.serverJob = undefined;
        vm.job = [];
        vm.goBack = goBack;
        vm.gotoJobDetails = gotoJobDetails;
        vm.updateClientList = updateClientList;

        //vm.gotoVariants = gotoVariants;
        vm.save = saveJob;
        vm.clients = [];
        vm.newClientInfo = [];
        vm.jobTypes = [];
        vm.remarks = [];
        vm.sectors = [];
        vm.priority = [];
        vm.sidVariants = [];
        vm.sidCardTypes = [];

        vm.jobsetup = {};

        vm.jobNames = [];
        vm.jobName = undefined;
        vm.jobQuantity;

        vm.serverJobs = [];
        vm.filteredServerJobs = [];
        vm.serverJobsSearch = '';
        vm.search = search;

        vm.serverJobCount = 0;
        vm.serverJobFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize: 20
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.serverJobFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        vm.errorMessage = '';

        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedServerJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Variants View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            console.log(lookups);
            vm.clients = lookups.clients;
            vm.serviceTypes = lookups.serviceTypes;
            vm.remarks = lookups.remarks;
            vm.sectors = lookups.sectors;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.dictionaryClientNames = lookups.dictionaryClientNames;
            vm.dictionaryCardTypes = lookups.dictionaryCardTypes;
            vm.dictionaryServiceTypes = lookups.dictionaryServiceTypes;
        }

        function getRequestedServerJob() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.resourcejob.getByServerJobQueueId(val)
                .then(function (data) {
                    
                    vm.jobsetup.jobName = data.jobName;
                 
                    var fileName = vm.jobsetup.jobName.toLowerCase();
                    fileName = fileName.replace(/\s/gi, "_");
                    vm.fileName = fileName;

                    getClientName(fileName);
                    getCardType(fileName);
                    getJobQuantity(fileName);

                    if (vm.jobsetup.sidClient) {
                        getServiceType(vm.jobsetup.sidClient);
                    }
                    
                    return vm.jobsetup;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }


        function getCardType(fileName) {
            var found = false;
            for (var i = 0; i < vm.dictionaryCardTypes.length && !found; i++) {
                var cardCodes = vm.dictionaryCardTypes[i].cardCodeName.toLowerCase();
                var res = cardCodes.split("_");

                for (var j = 0; j < res.length && !found; j++) {
                    var n = fileName.indexOf(res[j]);
                    if (n > 0) {
                        found = true;
                        if (found) {
                            vm.jobsetup.sidCardType = vm.dictionaryCardTypes[i].sidCardType;
                        }
                        break;
                    }
                }
            }

            
        }

        function getServiceType(clientDetail) {
            vm.clientServices = [];

            angular.forEach(vm.dictionaryServiceTypes, function (todo, key) {
                if (todo.sidClientId == clientDetail.id) {
                    vm.clientServices.push(todo);
                }
            });

            var found = false;

            if (vm.clientServices.length > 0) {
                console.log('Have setting');

                for (var i = 0; i < vm.clientServices.length && !found; i++) {
                    // get the service from the fileName
                    if (vm.jobsetup.sidCardType) {
                        getServiceNameFromFIleName(vm.jobsetup.sidClient.id, vm.jobsetup.sidCardType.id);
                    }
                }
                
            } else {
                console.log('No setting');
            }

        }

        function getServiceNameFromFIleName(clientId, cardId) {
            vm.selectedClientServices = [];
            angular.forEach(vm.clientServices, function (todo, key) {
                if (todo.sidCardTypeId == cardId) {
                    vm.selectedClientServices.push(todo);
                }
            });

            var found = false;
            for (var i = 0; i < vm.selectedClientServices.length && !found; i++) {
                var serviceCodes = vm.selectedClientServices[i].serviceCodeName.toLowerCase();
                var res = serviceCodes.split("_");

                for (var j = 0; j < res.length && !found; j++) {
                    var n = vm.fileName.indexOf(res[j].toLowerCase());
                    if (n >= 0) {
                        found = true;
                        if (found) {
                            console.log(vm.selectedClientServices[i].serviceType);
                            vm.jobsetup.serviceType = vm.selectedClientServices[i].serviceType;
                        }
                        break;
                    }
                }
            }
        }

        function getClientName(fileName) {
            // scan thru the array dictionary if the word in contain in the fileName
            var found = false;
            for (var i = 0; i < vm.dictionaryClientNames.length && !found; i++) {
                var shortCodes = vm.dictionaryClientNames[i].clientCodeName;
                // Check if we have _ split
                var res = shortCodes.split("_");

                for (var j = 0; j < res.length && !found; j++) {
                    var n = fileName.indexOf(res[j].toLowerCase());

                    if (n >= 0) {
                        found = true;

                        if (found) {
                            vm.jobsetup.sector = vm.dictionaryClientNames[i].sidClient.sector;
                            vm.updateClientList(vm.jobsetup.sector.id);
                            vm.jobsetup.sidClient = vm.dictionaryClientNames[i].sidClient;
                        }
                        break;
                    }
                }

            }

        }

        function wordInString(s, word) {
            return new RegExp('\\b' + word + '\\b', 'i').test(s);
        }

        function getJobQuantity(entity) {
            var str = entity.replace(/_/g, " ").replace(/\./g, ' '); //.replace(/\./g, '_')
            var stringArray = [];
            stringArray = str.split(' ');

            for (var i = 0; i < stringArray.length; i++) {
                getJobNumber(stringArray[i]);
            }
        }

        function getJobNumber(entity) {
            // start with n and the next number is an interger
            // nFirst or n100
            if (entity.startsWith("n")) {
                if (isInt(entity.substring(1, entity.length))) { // cut the n and check theremain value
                    vm.jobsetup.quantity = entity.substring(1, entity.length);
                }
            }
        }

        function isInt(value) {
            return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
        }

        function gotoJobDetails(entity) {
            console.log(entity);
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            console.log(vm.jobsetup);

            if (document.getElementById('jobName').value == ""
                 || document.getElementById('jobName').value == undefined) {
                alert("Please select a valid Job Name");
                return false;
            }


            var remarkValue;
            if (vm.jobsetup.remark === undefined) {
                remarkValue = '';
            } else {
                remarkValue = vm.jobsetup.remark.name;
            }

            if (vm.jobsetup.jobName !== null || vm.jobsetup.jobName !== undefined) {
                vm.newJob = {
                    jobName: vm.jobsetup.jobName,
                    jobNameId: vm.jobsetup.jobNameId,
                    sidSectorId: vm.jobsetup.sector.id,
                    sidClientId: vm.jobsetup.sidClient.id,
                    sidCardTypeId: vm.jobsetup.sidCardType.id,
                    remark: remarkValue,
                    ServiceTypeId: vm.jobsetup.serviceType.id,
                    quantity: vm.jobsetup.quantity
                };

                createEntity(vm.newJob);
            } else {
                console.log('error');
                vm.errorMessage = 'No Job Selected'
            }

        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.co + '/job/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.serverJob = {};
                vm.jobsetup = {};
                gotoJobStatus();
            },
			 function (response) {
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			     gotoJobStatus();
			 });
        }

        function gotoJobStatus() {
            $location.path('/co/pending-jobs');
        }

        function updateClientList(entity) {
            vm.newClientInfo = [];
            var uid = vm.jobsetup.sector.id;
            angular.forEach(vm.clients, function (todo, key) {
                if (todo.sectorId == uid) {
                    vm.newClientInfo.push(todo);
                }
            });
        }

        function getServerJobs(forceRefresh) {
            return datacontext.resourcejob.getServerJobQueues(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    vm.jobNames = vm.serverJobs = vm.filteredServerJobs = data;
                    if (!vm.serverJobCount || forceRefresh) {
                        getServerJobCount();
                    }
                    getServerJobFilteredCount();
                    return data;
                });
        }

        function getServerJobCount() {
            return datacontext.resourcejob.getServerJobCount().then(function (data) {
                return vm.serverJobCount = data;
            });
        }

        function getServerJobFilteredCount() {
            vm.serverJobFilteredCount = datacontext.resourcejob.getServerJobFilteredCount(vm.serverJobsSearch);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) { vm.serverJobsSearch = ''; }
            getServerJobs();
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getServerJobs();
        }

    }
})();
