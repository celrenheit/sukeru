var inherits = require('inherits');
var validators = require('../validators.js');

var stringProperty = module.exports = function(name, defaultValue) {
	var self = this;
	var opts = {
		type: 'string'
	};
	if(defaultValue)
		opts['default'] = defaultValue;
	this.addProperty(name, opts);
	return {
		required: function(msg) {
			self.addValidationRule(name, validators.required, msg || "Field "+ name +" is required", 'required');
			return this;
		},
		isLength: function(min, max, msg) {
			self.addValidationRule(name, function(val) {
				return validators.isLength(val, min, max);
			}, msg || "Field "+ name +" is not in the length required");
			return this;
		},
		minLength: function(min, msg) {
			self.addValidationRule(name, function(val) {
				return validators.isLength(val, min);
			}, msg || "Field "+ name +" has less than "+ min +" characters");
			return this;
		},
		maxLength: function(max, msg) {
			self.addValidationRule(name, function(val) {
				return validators.isLength(val, 0, max);
			}, msg || "Field "+ name +" has more than "+ max +" characters");
			return this;
		},
		email : function(msg) {
			self.addValidationRule(name, validators.isEmail, msg || "Field "+ name +" is not an email address");
			return this;
		},
		alphanumeric: function(msg) {
			self.addValidationRule(name, validators.isAlphanumeric, msg || "Field is not an alphanumeric value");
			return this;
		},
		custom: function(fn, msg) {
			self.addValidationRule(name, fn, msg || "Custom method not validated");
			return this;
		}
	};
}
