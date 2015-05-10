'use strict';

angular.module('gdweApp')
  .controller('GasMonitorCtrl', function ($scope, c3Factory, $timeout, $interval, $q, GasMonitor, Auth) {

    $scope.data = [];                           //总数据 初始化
    $scope.columns = [['time'],['vol浓度']];    //实时信息轴 初始化
    $scope.dataLength = 30;                     //实时信息轴 采样数, 若为0则为数据追加模式
    $scope.alarmValue = 350;                    //报警阙值

    $scope.realTimeConfig = {
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

    $scope.totalTimeConfig = {
      data: {
        x: 'time',
        columns: [
            ['time']
        ],
        type: 'area-spline',
        // labels: true,
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
          }
          // y: {
          //   max: $scope.alarmValue * Math.sqrt(2)
          // }
      },
      grid: {
          y: {
              lines: [{value: $scope.alarmValue}]
          }
      },
      transition: {
          duration: 0
      },
	    point: {
	        show: false
	    }
    };

    $scope.realTimeChart = c3Factory.get('realTimeChart');
    $scope.totalTimeChart = c3Factory.get('totalTimeChart');

    // 单次拉取固定时间数据
    $scope.getDataByTimeRange = function(from, to){

    	console.log(from, to);
	    
      loadNewData({
    		timeFrom: (new Date() - 10*60*1000).valueOf(),
    		timeTo: (new Date() - 0*60*1000).valueOf()
      }).then(function(data){
        reDraw($scope.totalTimeChart, data);
      });
    }

    // 循环拉取数据
    var intervalPromise = $interval(function(){
      loadNewData({count: $scope.dataLength}).then(function(data){
        reDraw($scope.realTimeChart, data);
      });
    },1000);

    // 获取新数据
    function loadNewData(conditions){
      var defer = $q.defer();
      GasMonitor.save({
        gas_level: parseInt(Math.random()*500>400?Math.random()*1000:100+Math.random()*50),
      },function(newdata){
        GasMonitor.query(conditions,function(datas){
          defer.resolve(setData(datas));
        });
      },function(err){
      	$interval.cancel(intervalPromise);
      });
      return defer.promise;
    }

    // 整理数据
    function setData(datas){
      var columns = angular.copy($scope.columns);
      angular.forEach(datas, function(data){
        columns[0].push(new Date(data.created_time));
        columns[1].push(parseInt(data.gas_level));
      });
      return columns;
    }

    // 重绘chart
    function reDraw(chart, data){
      chart.then(function(chart){
        chart.load({
          columns: data
        });        
      });
    }

    // 监听跳转，注销循环
    $scope.$on('$destroy',function(){
      $interval.cancel(intervalPromise);
    })

  });
