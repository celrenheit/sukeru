var validator = require('validator');
var utils = require('utilities');

var baseValidators = {
	required: function(val) {
		return !utils.isEmpty(val);
	},
	isLength: function(val, min, max) {
		return validator.isLength(val, min, max);
	},
	isEmail: function(val) {
		return validator.isEmail(val)
	},
	isAlphanumeric: function(val) {
		return validator.isAlphanumeric(val);
	},
	isDate: function(val) {
		return validator.isDate(val);
	},
	isAfter: function(val, date) {
		return validator.isAfter(val, date);
	},
	isBefore: function(val, date) {
		return validator.isBefore(val, date);
	}
};


module.exports = baseValidators;
