'use strict';

angular.module('gdweApp')
  .controller('CheckByTimeCtrl', function ($scope, c3Factory, $timeout, $interval, $q, GasMonitor, Auth) {

    $scope.columns = [['time'],['vol浓度']];    		//实时信息轴 初始化
    $scope.alarmValue = 350;                    		//报警阙值
    $scope.simpleDataLength = 500;                  //清洗数据阙值，超过后进行简化数据

    $scope.date_from = new Date() - 10*60*1000;
    $scope.date_to = new Date() - 0*60*1000;

    $scope.totalTimeConfig = {
      data: {
        x: 'time',
        columns: [
            ['time']
        ],
        type: 'area',
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
	    },
      subchart:{
        show: true
      }
    };

    $scope.totalTimeChart = c3Factory.get('totalTimeChart');

    // 单次拉取固定时间数据
    $scope.getDataByTimeRange = function(){
  		var from = new Date($scope.date_from).getTime(),
          to = new Date($scope.date_to).getTime();
      loadNewData({
    		timeFrom: parseInt(from),
    		timeTo: parseInt(to)
      }).then(function(data){
        reDraw($scope.totalTimeChart, data);
      });
    }

    // 获取新数据
    function loadNewData(conditions){
      var defer = $q.defer();

      GasMonitor.query(conditions,function(datas){
        defer.resolve(setData(datas));
      });
      
      return defer.promise;
    }

    function toSimpleData(datas){
      // var time = 0;
      var simpleDatas = [];

      datas.reduceRight(function(pre,post){

        if(post.gas_level > $scope.alarmValue){
          if(pre.gas_level < $scope.alarmValue){
            // console.log(">>记录pre :",pre.created_time,pre.gas_level,time++);
            simpleDatas.push(pre);
          }
          // console.log(">>记录post:",post.created_time,post.gas_level,time++);
          simpleDatas.push(post);
        }else{
          if(pre.gas_level > $scope.alarmValue){
            // console.log(">>记录post:",post.created_time,post.gas_level,time++);
            simpleDatas.push(post);
          }
        }
        return post;
      });

      return simpleDatas;
    }


    // 整理数据
    function setData(datas){

      if(datas.length === 0) return;
      if(datas.length > $scope.simpleDataLength){
        console.log("数据过多，进行清洗",datas.length);
        datas = toSimpleData(datas);
      }

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

  });
