'use strict';

angular.module('gdweApp')
  .controller('MainCtrl', function ($scope, $http, socket, c3Factory, $timeout) {

    $scope.config = {
      data: {
        x: 'time',
        columns: [
            ['time']
        ]
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%m/%d',
              }
          }
      }
    };

    $timeout(function(){

      c3Factory.get('chart').then(function(chart) {
        chart.load({
          columns: [
              ['time', '2012-12-29', '2012-12-30', '2012-12-31', '2013-01-01'],
              ['data1', 230, 300, 330, 111],
              ['data2', 190, 230, 200, 222],
              ['data3', 90, 130, 180, 333],
          ]
        });
      });

    },1000);



    /*$scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });*/
  });
