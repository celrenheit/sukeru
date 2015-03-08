var should = require('should');
var sukeru = require('../');

describe('Model', function () {
	var User, userId;

	before(function(done) {
		sukeru.connect('http', function() {
			User = sukeru.model("User", function() {
				this.string('email_s');
				this.string('password');
			});
			done();
		});
		
	});


	it('should be an instance of model', function (done) {
		var user = new User();
		user.should.be.an.instanceof(require('../lib/model'));
		done();
	});

	it('should save a new model', function (done) {
		var user = new User();
		user.email_s = 'test@test.com';
		user.password = 'password';
		user.save(function(err) {
			userId = user.id;
			user.should.have.property("id");
			user.email_s.should.equal('test@test.com');
			user.password.should.equal('password');
			done();
		});
	});

	it('should find the users just saved', function(done) {
		User.findById(userId, function(err, user) {
			should.not.exist(err);
			user.email_s.should.equal('test@test.com');
			done();
		});
	});

	it('should find the users just saved and edit the email_s address', function(done) {
		User.findById(userId, function(err, user) {
			user.email_s = 'newmail@newmail.com';
			user.save(function(err) {
				should.not.exist(err);
				user.email_s.should.equal('newmail@newmail.com');
				done();
			});
		});
	});

	it('should search for an email_s address', function (done) {
		User.search({
			q: 'email_s:newmail@newmail.com',
			rows: 3
		}, function(err, users) {
			should.not.exist(err);
			done();
		});

	});

	it('should delete a user by a static method', function(done) {
		User.remove(userId, function(err) {
			should.not.exist(err);
			User.exists(userId, function(err, exist) {
				should.not.exist(err);
				exist.should.be.false;
				done();
			});
		});
	});

	it("should delete just created", function(done) {
		var u = new User();
		u.email_s = "test@test.com";
		u.password = "pass";
		u.save(function(err) {
			u.remove(function(err, res) {
				should.not.exist(err);
				User.exists(u.id, function(err, exist) {
					should.not.exist(err);
					exist.should.be.false;
					done();
				});
			});
		});
	});
});
