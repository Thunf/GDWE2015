/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gasdata = require('./gasdata.model');

exports.register = function(socket) {
  Gasdata.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Gasdata.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('gasdata:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('gasdata:remove', doc);
}