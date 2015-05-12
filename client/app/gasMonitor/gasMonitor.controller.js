'use strict';

angular.module('gdweApp')
  .controller('GasMonitorCtrl', function ($scope, c3Factory, $timeout, $interval, $q, GasMonitor, Auth) {

    $scope.alerts = [
      // { type: 'danger',  msg: 'danger' },
      // { type: 'warning', msg: 'warning' },
      // { type: 'info',    msg: 'info' },
      // { type: 'success', msg: 'success' }
    ];

    $scope.addAlert = function(message) {
      $scope.alerts.push(message || {msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

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

    $scope.realTimeChart = c3Factory.get('realTimeChart');

    // 循环拉取数据
    var intervalPromise = $interval(function(){
      loadNewData({count: $scope.dataLength}).then(function(data){
        reDraw($scope.realTimeChart, data);
      });
    },1000);

    // 获取新数据
    function loadNewData(conditions){
      var defer = $q.defer();

      // GasMonitor.save({
      //   gas_level: parseInt(Math.random()*500>400?Math.random()*500:100+Math.random()*50),
      // },function(newdata){


        GasMonitor.query(conditions,function(datas){
          defer.resolve(setData(datas));
        });


        
      // },function(err){
      // 	$interval.cancel(intervalPromise);
      // });

      return defer.promise;
    }

    // 整理数据
    function setData(datas){
      var columns = angular.copy($scope.columns);
      $scope.alerts = [];
      angular.forEach(datas, function(data){
        columns[0].push(new Date(data.created_time));
        columns[1].push(parseInt(data.gas_level));
        if(parseInt(data.gas_level) > $scope.alarmValue){
          $scope.addAlert({ type: 'danger', msg: '浓度过高！', time: getTime(data.created_time), gas_level: data.gas_level});
        }
      });
      if($scope.alerts.length === 0){
        $scope.addAlert({ type: 'success', msg: '浓度正常！', time: '', gas_level: ''});
      }
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

    // 整理时间格式
    function getTime(time){
      var newtime = new Date(time),
          year = newtime.getFullYear(),
          month = newtime.getMonth() + 1,
          date = newtime.getDate(),
          hour = newtime.getHours(),
          minute = newtime.getMinutes(),
          second = newtime.getSeconds(),
          fulltime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second,
          half_fulltime = hour + ":" + minute + ":" + second;
      return half_fulltime;
    }

    // 监听跳转，注销循环
    $scope.$on('$destroy',function(){
      $interval.cancel(intervalPromise);
    })

  });
