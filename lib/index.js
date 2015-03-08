var EventEmitter = require("events").EventEmitter;
var inherits = require('util').inherits;
var pluralize = require('pluralize');
var model = require('./model');
var ModelCompiler = require('./modelCompiler');
var _ = require('lodash');
var Sukeru = module.exports = function() {
	this.schemas = {};
	this.models = {};
	this.modelCompiler = new ModelCompiler(this);
	this.db = null;
};

inherits(Sukeru, EventEmitter);

Sukeru.prototype.connect = function() {
	var defaults = {
		resources: {
			riak_kv_wm_bucket_type: '/types'
		}
	};
	var argKeys = Object.keys(arguments);
	var cb = (argKeys.length && typeof arguments[argKeys.length-1] == "function") 
				? arguments[argKeys.length-1] : function() {};
	if(argKeys.length && typeof arguments[argKeys.length-1] == "function") {
		cb = arguments[argKeys.length-1]; 
		delete arguments[argKeys.length-1];
	} else {
		cb = function() {};
	}
	this.db = require('nodiak').getClient.apply(null, arguments);
	this.db.loadResources(function(err, response) {
		cb(response);
	});

};

Sukeru.prototype.getModel = function(modelName) {
	return this.models[modelName];
};
Sukeru.prototype.addModel = function(modelName, model) {
	return this.models[modelName] = model;
};
Sukeru.prototype.hasModel = function(modelName) {
    return this.models.hasOwnProperty(modelName);
};
Sukeru.prototype.hasSchema = function(schemaName) {
	return this.schemas.hasOwnProperty(schemaName);
};
Sukeru.prototype.registerSchema = function(modelName, schemaFn) {
	return this.schemas[modelName] = schemaFn;
};

Sukeru.prototype.model = function(name, schemaFn) {
	// var modelName = pluralize(name.toLowerCase());
	var modelName = name.toLowerCase();
	if(this.hasSchema(modelName)) {
		return this.getModel(modelName);
	}
	this.registerSchema(modelName, schemaFn);
	model = this.modelCompiler.compile(modelName, schemaFn);
	this.addModel(modelName, model);

	return this.getModel(modelName);
}
