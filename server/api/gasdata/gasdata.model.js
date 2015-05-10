'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GasdataSchema = new Schema({
	created_time:{
		type: Date,
		default: Date.now
	},
	creator:{
		type: Schema.ObjectId,
		ref: 'User'
	},
	gas_level:{
		type: Number,
		trim: true,
		required: true
	}
});

module.exports = mongoose.model('Gasdata', GasdataSchema);