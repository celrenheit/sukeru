var Model = require('./model');
var __extends = require('./utils/__extends.js');

var ModelDefinition = function(rodm, modelName,schemaFn) {
	this.rodm = rodm;
	this.modelName = modelName;
	this.schemaFn = schemaFn;
	this.schema = {
		name: modelName,
		properties: {},
		validations: {}
	};
	this.methods = {};
	this.statics = {};
};

ModelDefinition.prototype = {
	bucket: require('./riak/bucket.js'),
	string: require('./properties/string.js'),
	boolean: require('./properties/boolean.js'),
	date: require('./properties/date.js')
};

ModelDefinition.prototype.addProperty = function(name, def) {
	this.schema.properties[name] = def;
};

ModelDefinition.prototype.getProperties = function() {
	return Object.keys(this.schema.properties);
};

ModelDefinition.prototype.addValidationRule = function(property, fn, msg, name) {
	if(!this.schema.validations.hasOwnProperty(property))
		this.schema.validations[property] = [];
	this.schema.validations[property].push({
		name: name || '',
		rule: fn,
		msg: msg
	});
};

ModelDefinition.prototype.getValidationRules = function() {
	return Object.keys(this.schema.validations);
};

ModelDefinition.prototype.compile = function(fn) {
	fn.call(this);

	var model = (function (_super) {
      // Inherit from Model
      __extends(model, _super);

      function model() {
        return model.__super__.constructor.apply(this, arguments);
      }

      return model;

    })(Model);

    for(func in this.methods) {
    	model.prototype[func] = this.methods[func];
    }

    for(func in this.statics) {
    	model[func] = this.statics[func];
    }

    var bucket = this.rodm.db.bucket(this.schema.name);
    bucket.props = {
		search_index: this.schema.name
	};

    model.prototype.schema = model.schema = this.schema;
    model.prototype.rodm = model.rodm = this.rodm;
    model.prototype.bucket = model.bucket = bucket;

    return model;
};


var ModelCompiler = module.exports = function(rodm) {
	this.rodm = rodm;
};


ModelCompiler.prototype.compile = function(modelName, schemaFn) {
	var modelDef = new ModelDefinition(this.rodm, modelName);
	var compiled = modelDef.compile(schemaFn);
	
	return compiled;
};

