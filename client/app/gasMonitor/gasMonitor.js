'use strict';

angular.module('gdweApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gasMonitor', {
        url: '/gasMonitor',
        templateUrl: 'app/gasMonitor/gasMonitor.html',
        controller: 'GasMonitorCtrl'
      });
  });