'use strict';

angular.module('gdweApp')
  .controller('MainCtrl', function ($scope, $http, socket, c3Factory, $timeout, $interval, $q) {

    $scope.data = [];                           //总数据 初始化
    $scope.columns = [['time'],['vol浓度']];    //实时信息轴 初始化
    $scope.dataLength = 30;                     //实时信息轴 采样数
    $scope.alarmValue = 350;                    //报警阙值

    $scope.config = {
      data: {
        x: 'time',
        columns: [
            ['time']
        ],
        type: 'area',
        labels: true,
        color: function(color, d){
          return (d.value > $scope.alarmValue ? '#F00' : color);
        }
      },
      axis: {
          x: {
            type: 'timeseries',
            tick: {
                format: '%H:%M:%S'
            }
          },
          y: {
            max: $scope.alarmValue * Math.sqrt(2)
          }
      },
      grid: {
          y: {
              lines: [{value: $scope.alarmValue}]
          }
      },
      transition: {
          duration: 0
      }
    };

    $scope.chart = c3Factory.get('chart');

    $interval(function(){

      loadNewData(new Date()).then(function(data){
        reload(data);
      });
      
    },1000);

    function loadNewData(time){
      var defer = $q.defer();

      if($scope.dataLength && $scope.data.length >= $scope.dataLength){
        $scope.data.splice(0,1);
      }
      $scope.data.push({
        'time': time,
        'value': parseInt(Math.random()*500>400?Math.random()*1000:100+Math.random()*50)
      });

      if($scope.dataLength && $scope.columns[0].length > $scope.dataLength){
        $scope.columns[0].splice(1,1);
        $scope.columns[1].splice(1,1);
      }
      $scope.columns[0].push($scope.data[$scope.data.length-1].time);
      $scope.columns[1].push($scope.data[$scope.data.length-1].value);

      defer.resolve(time);
      return defer.promise;
    }

    function reload(data){
      $scope.chart.then(function(chart){
        chart.load({
          columns: $scope.columns
        });        
      });
    }

  });
