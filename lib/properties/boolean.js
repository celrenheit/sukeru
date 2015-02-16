module.exports = function(name, defaultValue) {
	var opts = {
		type: 'boolean'
	};
	if(defaultValue)
		opts['default'] = defaultValue;
	this.addProperty(name, opts);
};