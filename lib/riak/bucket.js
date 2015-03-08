var _ = require("lodash");
_.mergeDefaults = require('merge-defaults');

module.exports = function(name, props) {
	this.setBucket(name, _.mergeDefaults(props || {}, this.bucketProps));
};