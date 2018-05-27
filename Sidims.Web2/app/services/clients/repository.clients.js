(function () {
    'use strict';
    var serviceId = 'repository.clients';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', RepositoryClientResource]);

    function RepositoryClientResource($routeParams, common, authService, model, AbstractRepository) {
        var entityName = model.entityNames.person;
        var EntityQuery = breeze.EntityQuery;
        var filterValue = authService.authentication.userName;
        var Predicate = breeze.Predicate;
        var $q = common.$q;
        
        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getById = getById;
            this.getDeliveryNoteById = getDeliveryNoteById;
            this.getDeliveryProfileById = getDeliveryProfileById;

            this.getPendingJobs = getPendingJobs;
            this.getCompletedJobs = getCompletedJobs;
            this.getDispatchDelivery = getDispatchDelivery;
            this.getDeliveryReports = getDeliveryReports;
            this.getProductionStaffs = getProductionStaffs;

            this.getProducts = getProducts;
            this.getClientStockReports = getClientStockReports;
            this.getClientStockLogByStockReportId = getClientStockLogByStockReportId;
            this.getCardIssuanceByStockLog = getCardIssuanceByStockLog;
            this.getJobByCardIssuanceId = getJobByCardIssuanceId;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getDeliveryNoteById(id, forceRemote) {
            return this._getById(entityNames.deliveryNote, id, forceRemote);
        }

        function getDeliveryProfileById(id, forceRemote) {
            return this._getById(entityNames.deliveryProfile, id, forceRemote);
        }




        function getJobs(forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'createdOn desc';

            return EntityQuery.from('Jobs')
                .select('id, jobName, sidSectorId, sidClientId, sidCardTypeId, jobStatusId, remark, serviceTypeId, quantity, createdOn')
                .orderBy(orderBy)
                .toType(entityNames.job)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var entity = self._setIsPartialTrue(data.results);
                return entity;
            }
        }

        function getClientProducts(clientId, forceRemote, page, size, nameFilter) {
            var self = this;
            var entity = [];
            var orderBy;

            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;

            console.log(self._areItemsLoaded());

            if (self._areItemsLoaded() && !forceRemote) {
                console.log(self._areItemsLoaded());
                // Get the page of attendees from local cache
                return self.$q.when(getByPage());
            }

            return EntityQuery.from('ClientProducts')
                .select('id, sidClientId, sidCardTypeId, name')
                .withParameters({ clientId: clientId })
                .toType('SidProduct')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }


        }


        function getProducts(clientId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('ClientProducts')
                .select('id, sidClientId, sidCardTypeId, name, shortCode')
                .withParameters({ clientId: clientId })
                .orderBy(orderBy)
                .toType('SidProduct')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [SidProducts Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

      

        function getPendingJobs(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'createdOn desc';

            return EntityQuery.from('ClientPendingJobs')
                .select('id, jobName, sidSectorId, remark, serviceTypeId, jobStatusId, quantity, createdOn')
                .withParameters({ clientId: clientId })
                .orderBy(orderBy)
                .toType('Job')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }

        function getCompletedJobs(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'createdOn desc';

            return EntityQuery.from('ClientCompletedJobs')
                .select('id, jobName, sidSectorId, remark, serviceTypeId, jobStatusId, quantity, createdOn')
                .withParameters({ clientId: clientId })
                .orderBy(orderBy)
                .toType('Job')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }


        function getDispatchDelivery(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchDelivery')
                .select('id, sidClientId, jobTrackerId, rangeFrom, rangeTo')
                .withParameters({ clientId: clientId })
                .toType('DispatchDelivery')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DispatchDelivery Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDeliveryReports(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientDispatchDeliveryNotes')
                .select('id, sidClientId, deliveryProfileId, createdById, description, transactionDate')
                .withParameters({ clientId: clientId })
                .toType('DeliveryNote')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }

        function getProductionStaffs(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            return EntityQuery.from('ProductionStaffs')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved[ProductionStaffAccount Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        function getClientStockReports(sidProductId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientStockReports')
                .select('id, sidProductId, qtyIssued, wasteQty, returnQty, openingStock, closingStock, createdOn, clientVaultReportId, fileName')
                .withParameters({ sidProductId: sidProductId })
                .toType('ClientStockReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [StockReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientStockLogByStockReportId(stockReportId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientStockLogByStockReportId')
                .select('id, clientStockReportId, cardIssuanceId, issuanceQty, openingStock, closingStock')
                .withParameters({ stockReportId: stockReportId })
                .toType('ClientStockLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [ClientStockLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardIssuanceByStockLog(stockReportId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceByStockLog')
                .select('id, jobId, totalQuantity, totalQuantityIssued, totalQuantityRemain, totalWaste, totalHeld')
                .withParameters({ stockReportId: stockReportId })
                .toType('CardIssuance')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }

        function getJobByCardIssuanceId(stockReportId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('JobByCardIssuanceId')
                .select('id, jobName, createdOn')
                .withParameters({ stockReportId: stockReportId })
                .toType('Job')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }



    }
})();