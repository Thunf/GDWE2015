'use strict';

describe('Service: gasMonitor', function () {

  // load the service's module
  beforeEach(module('gdweApp'));

  // instantiate service
  var gasMonitor;
  beforeEach(inject(function (_gasMonitor_) {
    gasMonitor = _gasMonitor_;
  }));

  it('should do something', function () {
    expect(!!gasMonitor).toBe(true);
  });

});
