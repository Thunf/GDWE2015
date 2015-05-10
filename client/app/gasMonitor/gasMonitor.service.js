'use strict';

angular.module('gdweApp')
  .factory('GasMonitor', function ($resource) {
    return $resource('/api/gasdatas/:id/:controller', {
      id: '@_id'
    },
    {
      // get: {
      //   method: 'GET',
      //   params: {
      //     id:'me'
      //   }
      // },
      // setMeta: {
      // 	method: 'PUT',
      // 	params: {
      //     controller:'active'
      //   }
      // },
      // sendMail:{
      //   method: 'POST',
      //   params: {
      //     id:'mail'
      //   }
      // }
	});
  });
