(function () {
    'use strict';
    var controllerId = 'JobCheckQA';
    angular
        .module('app')
        .controller('JobCheckQA', JobCheckQA);

    JobCheckQA.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function JobCheckQA($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.qaIncomingPersos = [];
        vm.save = save;

        vm.checkboxModel = {
            chip: false,
            magstripe: false,
            indenting: false,
            embossing: false,
            picture: false,
            fulfillment: false,
            client: false,
            cardtype: false,
            pictureView: false,
            variant: false,
            cardIdNumber: false,
            bin: false,
            magstripeTrack: false,
            cvv: false,
            panSpacing: false,
        };

        activate();

        function activate() {
            var promises = [getRequestedQABySplitId()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getRequestedQABySplitId() {
            var val = $routeParams.splitId;

            return datacontext.resourcejob.getQABySplitId(val)
                .then(function (data) {
                    vm.splitQA = data;
                    console.log(vm.splitQA);
                    //console.log(vm.splitQA);
                    //vm.checkboxModel = data[0].id;
                    //vm.checkboxModel = data[0].jobTrackerId;
                    //vm.checkboxModel = data[0].jobSplitId;
                    //console.log(vm.checkboxModel);
                    //console.log(vm.splitQA);
                }, function (error) {
                    logError('Unable to get QA ' + val);
                });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/qa/job-check/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.splitId;
          
            vm.checkboxModel.id = vm.splitQA[0].id;
            vm.checkboxModel.jobSplitId = vm.splitQA[0].jobSplitId;
            vm.checkboxModel.jobTrackerId = vm.splitQA[0].jobTrackerId;

            updateEntity(vm.checkboxModel);
        }
    
        function updateEntity(entity) {  
            var resourceUri = model.resourceUri.qac + '/jobcheckprocess/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                goBack();
                //$location.path('/qa/incoming-persos');
            },
			 function (response) {
			     console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }



        ////IncomingJobs => CE1 ==Queue
        //function getQAIncomingPersos(forceRefresh) {
        //    return datacontext.qacjob.getQAIncomingPersos(forceRefresh).then(function (data) {
        //        vm.qaIncomingPersos = data;
        //        console.log(vm.qaIncomingPersos);
        //        return vm.qaIncomingPersos;
        //    });
        //}

        ////Todo
        //function getJobs(forceRefresh) {
        //    return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
        //        vm.jobs = data;
        //        return vm.jobs;
        //    });
        //}

    }
})();
