'use strict';

angular.module('gdweApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('checkByTime', {
        url: '/checkByTime',
        templateUrl: 'app/checkByTime/checkByTime.html',
        controller: 'CheckByTimeCtrl'
      });
  });