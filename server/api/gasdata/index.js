'use strict';

var express = require('express');
var controller = require('./gasdata.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// router.get('/', auth.isAuthenticated(), controller.index);
// router.post('/', auth.isAuthenticated(), controller.create);

router.get('/', controller.index);
router.post('/', controller.create);

// router.get('/:id', auth.isAuthenticated(), controller.show);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;