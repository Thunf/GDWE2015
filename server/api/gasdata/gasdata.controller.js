'use strict';

var _ = require('lodash');
var Gasdata = require('./gasdata.model');

function getTime(time){
  var newtime = new Date(parseInt(time));
  var year = newtime.getFullYear();
  var month = newtime.getMonth() + 1;
  var date = newtime.getDate();
  var hour = newtime.getHours();
  var minute = newtime.getMinutes();
  var second = newtime.getSeconds();
  var fulltime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  return fulltime;
}

// Get list of gasdatas
exports.index = function(req, res) {

  var conditions = {};

  if(req.query && req.query.timeFrom){
    console.log(">>> 按时间额度查询，时间范围：", getTime(req.query.timeFrom), getTime(req.query.timeTo));
    conditions = {"$and":[
        {"created_time":{"$gt":new Date(parseInt(req.query.timeFrom))}},
        {"created_time":{"$lt":new Date(parseInt(req.query.timeTo))}}
      ]
    }
  }

  var queryWork = Gasdata.find(conditions).sort({created_time: 'desc'});

  if(req.query && req.query.count){
    console.log(">>> 实时查询，限量：",req.query.count);
    queryWork.limit(req.query.count);
  }
    
  queryWork.exec(function (err, gasdatas) {
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
  console.log(">>>>进入create，gas_level:",req.body.gas_level);
  req.body.creator = req.user;
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