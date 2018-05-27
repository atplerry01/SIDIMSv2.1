(function () {
    'use strict';
    var controllerId = 'CardSetupDetailIN';
    angular
        .module('app')
        .controller('CardSetupDetailIN', CardSetupDetailIN);

    CardSetupDetailIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function CardSetupDetailIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        vm.cardsetup = undefined;

        vm.issuanceLogs = [];
        vm.collectors = [];
        vm.job = undefined;
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;
        vm.selectedClientVariant = [];
        vm.newProducts = [];
        vm.updateProductService = updateProductService;

        activate();

        function activate() {
            initLookups();
          
            var promises = [getRequestedJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.jobStatus = lookups.jobStatus;
            vm.products = lookups.sidProducts;
            vm.productServices = lookups.productServices;
            vm.sidVariants = lookups.sidVariants;
        }
    
        function getRequestedJob() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    getJobs(); //Todo: get the Request job Navigation
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function updateProductService() {

            vm.newProductServices = [];
            angular.forEach(vm.productServices, function (todo, key) {
                if (todo.sidProductId == vm.cardsetup.product.id) {
                    vm.newProductServices.push(todo);
                }
            });

            vm.cardsetup.serviceType = vm.newProductServices[0];

            if (vm.cardsetup.serviceType) {
                getProductImage(vm.cardsetup.serviceType.sidProductId);
            }
        }
      
        function getProductImage(entity) {
            console.log(entity);

            return datacontext.inventory.getProductImage(entity)
                .then(function (data) {
                    vm.productImage = '';
                    vm.productImage = data[0];
                    //vm.productImage.imagePath = "http://localhost:53401/uploads/15672683_120805.jpg";
                    //console.log(vm.productImage.imagePath);
                    console.log(vm.productImage);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.trackerId;

            vm.newEntity = {
                jobId: vm.jobTracker.jobId,
                jobTrackerId: vm.jobTracker.id,
                sidProductId: vm.cardsetup.product.id,
                serviceTypeId: vm.cardsetup.serviceType.serviceTypeId
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var val = $routeParams.trackerId;
            var resourceUri = model.resourceUri.inventory + '/jobvariant/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.cardsetup = {};
                console.log(response);
                $location.path('/in/card-issuance/' + val);
            },
			 function (response) {
			     console.log(response);
			 });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;            
                vm.cardsetup = {
                    cardType: vm.jobTracker.job.sidCardType.name
                };

                getProductList(vm.jobTracker.job.sidClientId, vm.jobTracker.job.sidCardType.id);

                return vm.jobs;
            });
        }

        function getProductList(clientId, cardTypeId) {
            angular.forEach(vm.products, function (todo, key) {
                if (todo.sidCardTypeId == cardTypeId && todo.sidClientId == clientId) {
                    vm.newProducts.push(todo);
                }
            });
        }


    }


})();
