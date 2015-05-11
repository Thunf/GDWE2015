'use strict';

describe('Controller: CheckByTimeCtrl', function () {

  // load the controller's module
  beforeEach(module('gdweApp'));

  var CheckByTimeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CheckByTimeCtrl = $controller('CheckByTimeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
