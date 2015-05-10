'use strict';

describe('Controller: GasMonitorCtrl', function () {

  // load the controller's module
  beforeEach(module('gdweApp'));

  var GasMonitorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GasMonitorCtrl = $controller('GasMonitorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
