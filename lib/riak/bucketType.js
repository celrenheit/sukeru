module.exports = function(name, props) {
	this.setBucketType(name, _.mergeDefaults(props || {}, {
		allow_mult: true
	}));
};