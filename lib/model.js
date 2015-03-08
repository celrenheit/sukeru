var shortId = require('shortid');
var Sukeru = require('../');

var Model = module.exports = function (rawElements, metadata) {
	this.loadPropertiesDefinitions();
	this.removeNonEnumerableProperties();

	// this.updateProps();
	this._meta = metadata || {};
	if(rawElements) 
		this.setProperties(rawElements);	
}

Model.prototype.updateProps = function(cb) {
	var self = this;
	var callback = cb || function() {};
	this.bucket.saveProps(false, function(err, props) {
		console.log(err, props);
		callback(err, props);
	});
};

Model.prototype.removeNonEnumerableProperties = function(first_argument) {

	Object.defineProperty(this, '$saved', {
		enumerate: false
	});
	
	Object.defineProperty(this, '_meta', {
		enumrable: false
	});
	
	Object.defineProperty(this, 'bucketName', {
		enumrable: false
	});
	
	Object.defineProperty(this, 'bucketTypeName', {
		enumrable: false
	});

};

Model.prototype.loadPropertiesDefinitions = function() {
	var self = this;
	/*Object.keys(this.schema.properties).forEach(function(prop) {
    	
    	var set = function(value) {
    			if(self.validate(prop, value))
    				self.setProperty(prop, value);
    			else 
    				throw new Error("Not valid");
    	};
    	var get = function() { return self.getProperty(prop); };
    	Object.defineProperty(self, prop, {
    		enumerable:true,
    		get: get,
    		set: set		
    	});

    });*/

};

Model.prototype.save = function(cb, opts) {
	if(this.hasOwnProperty("id")) {
		return this.update(cb, opts);
	} else {
		return this.insert(cb, opts);
	}
};

Model.prototype.insert = Model.prototype.update = function(cb, opts) {
	var self = this;
	if(this.check()) {
		var obj = this.bucket.object.new(this.hasOwnProperty("id") ? this.id : shortId.generate(), this.getProperties(), this._meta);
		this.bucket.objects.save(obj, function(err, result) {
			if(err)
				return cb(err);
			self.setProperty('id', result.key);
			cb(null, self);
		});
	} else 
		cb(new Error('A validation issue has occured'));
};

Model.prototype.remove = function(cb) {
	var robj = this.bucket.object.new(this.id, this.getProperties(), this._meta);
	this.bucket.objects.delete(robj, function(err, results) {
		cb(err, results);
	});
};

Model.prototype.setProperties = function(props) {
	for(property in this.schema.properties) {
		this.setProperty(property, props[property]);
	}
	var id = props.id || props._yz_rk || null;
	if(id)
		this.setProperty('id', id);
};

Model.prototype.setProperty = function(key, value) {
	this[key] = value;
	return this[key];
};

Model.prototype.getProperty = function(key) {
	return this[key];
};

Model.prototype.getProperties = function() {
	var self = this;
	var data = {};
	for(property in this.schema.properties) {
		data[property] = self.getProperty(property);
	}
	return data;
};

Model.prototype.check = function() {
	this.setDefaultsIfNotSet();
	return this.validate();
};

Model.prototype.setDefaultsIfNotSet = function() {
	for(property in this.schema.properties) {
		if(this.hasOwnProperty(property) && this.getProperty(property))
			continue;
		if(this.schema.properties[property].hasOwnProperty('default'))
			this.setProperty(property, this.schema.properties[property].default)
	}
};

Model.prototype.validate = function() {
	for(property in this.schema.properties) {
		if(!this.isValid(property))
			return false;
	}
	return true;
};

Model.prototype.isValid = function(property) {
	if(!this.schema.validations.hasOwnProperty(property))
		return true;

	for (var i = 0; i < this.schema.validations[property].length; i++) {
		var validation = this.schema.validations[property][i];

		if(!validation.rule(this.getProperty(property)))
			return false;
	}
	return true;
};

Model.prototype.setState = function(state) {
	return this['$'+state] = true;
};

Model.findById = function(id, cb) {
	if(!id) cb(new Error('No key specified'));
	var self = this;
	this.bucket.objects.get(id, function(err, obj) {
		if(err)	cb(err);
		obj.data['id'] = obj.key;
		// Instanciate a new instance of this Model and return it back
		var instance = new self(obj.data, obj.metadata);
		cb(null, instance);
	});
}

Model.remove = function(id, cb) {

	this.findById(id, function(err, user) {
		if(err)
			return cb(err);
		user.remove(cb);
	});
}
Model.exists = function(id, cb) {
	if(!id) 
		cb(new Error('No key specified'));
	this.bucket.object.exists(id, cb);
};

Model.search = function(query, cb) {
	var results = [];
	var self = this;
	this.bucket.search.solr(query, function(err, res) {
		// return cb(err, JSON.parse(res.toString()));
		if(err) {
			console.log(err);
			return cb(err);
		}
		var docs = JSON.parse(res.toString()).response.docs
		if(docs.length === 0) 
			return cb(null, []);
		var results = [];
		docs.forEach(function(doc, i, a) {
			var m = self.findById(doc._yz_rk, function(err, modelInstance) {
				if(err) {
					console.log(err);
					cb(err);
					return false;
				}
				results.push(modelInstance);
				if(i == a.length-1) 
					cb(err, results);
			})
		});
	});
};
