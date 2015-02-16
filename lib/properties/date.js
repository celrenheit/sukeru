var validators = require('../validators.js');

var dateProperty = module.exports = function(name, defaultValue) {
	var self = this;
	var opts = {
		type: 'date'
	};
	if(defaultValue)
		opts['default'] = defaultValue;
	this.addProperty(name, opts);
	var validations = {
		required: function(msg) {
			self.addValidationRule(name, validators.required, msg || "Field "+ name +" is required");
			return this;
		},
		date: function(msg) {
			self.addValidationRule(name, validators.isDate, msg || "Field "+ name +" should be a date");
			return this;
		},
		after: function(date, msg) {
			self.addValidationRule(name, function(val) {
				return validators.isAfter(val, date);
			}, msg || "Field "+ name +" should be after "+date);
			return this;
		},
		before: function(date, msg) {
			self.addValidationRule(name, function(val) {
				return validators.isBefore(val, date);
			}, msg || "Field "+ name +" should be before "+ date);
			return this;
		}
	};
	validations.date();
	return validations;

}
