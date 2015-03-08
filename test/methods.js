var should = require('should');
var sukeru = require('../');
var shortId = require('shortid');

describe('Methods', function() {
	before(function(done) {
		sukeru.connect('http', function() {
			done();
		});
	});

	it("should define a static method", function(done) {
		var uniqueModelName = "User_"+shortId.generate();
		var User = sukeru.model(uniqueModelName, function() {
			this.string('email');
			this.string('password').required();
			this.methods.comparePassword = function(password) {
				return this.password === password;
			};
			this.statics.create = function(credentials) {
				return new this(credentials);
			};
		});

		var u = new User();

		u.comparePassword("test").should.be.false;

		u.password = "secret";
		u.comparePassword("test").should.be.false;
		u.comparePassword("secret").should.be.true;

		var u2 = User.create({
			email: "test@test.com",
			password: "test"
		});

		u2.should.be.an.instanceof(require('../lib/model'));
		
		done();
	});
});