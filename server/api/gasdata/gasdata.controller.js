'use strict';

var _ = require('lodash');
var Gasdata = require('./gasdata.model');

// Get list of gasdatas
exports.index = function(req, res) {
  Gasdata.find(function (err, gasdatas) {
    if(err) { return handleError(res, err); }
    return res.json(200, gasdatas);
  });
};

// Get a single gasdata
exports.show = function(req, res) {
  Gasdata.findById(req.params.id, function (err, gasdata) {
    if(err) { return handleError(res, err); }
    if(!gasdata) { return res.send(404); }
    return res.json(gasdata);
  });
};

// Creates a new gasdata in the DB.
exports.create = function(req, res) {
  Gasdata.create(req.body, function(err, gasdata) {
    if(err) { return handleError(res, err); }
    return res.json(201, gasdata);
  });
};

// Updates an existing gasdata in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gasdata.findById(req.params.id, function (err, gasdata) {
    if (err) { return handleError(res, err); }
    if(!gasdata) { return res.send(404); }
    var updated = _.merge(gasdata, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, gasdata);
    });
  });
};

// Deletes a gasdata from the DB.
exports.destroy = function(req, res) {
  Gasdata.findById(req.params.id, function (err, gasdata) {
    if(err) { return handleError(res, err); }
    if(!gasdata) { return res.send(404); }
    gasdata.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}