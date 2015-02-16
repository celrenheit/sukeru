var should = require('should');
var rodm = require('../');
var shortId = require('shortid');

describe("Validation", function() {

	before(function(done) {
		rodm.connect('http', function() {
			done();
		});
		
	});
	describe("Strings", function() {
		it("should detect that a field is required", function(done) {
			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.string('email').required();
				this.string('password');
			});
			
			var u = new User();
			u.validate().should.be.false;

			u.password = "test";
			u.validate().should.be.false;

			u.email = "test";
			u.validate().should.be.true;

			done();
		});

		it("should find out that a field is outside its limit", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.string('email');
				this.string('password').isLength(4, 10); // Or .minLength(4).maxLength(10);
			});

			var u = new User();

			u.validate().should.be.false;

			u.password = "tes"; // below his minimum
			u.validate().should.be.false;

			u.password = "test"; // equals the minimum
			u.validate().should.be.true;

			u.password = "password"; // Between the min and max
			u.validate().should.be.true;

			u.password = "0123456789"; // equals the maximum
			u.validate().should.be.true;

			u.password = "12345678910" // exceeds its upper limit
			u.validate().should.be.false;

			done();
		});

		it("should add default value if not set", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.string('email', 'test@test.com');
				this.string('password');
			});

			var u = new User();

			u.should.not.have.property('email');

			u.check();
			u.should.have.property('email');
			u.email.should.equal('test@test.com');

			done();
		});

		it("should validate a custom method", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.string('name').custom(function(val) {
					return (val === "test")
				});
			});

			var u = new User();

			u.validate().should.be.false;

			u.name = 'batman';
			u.validate().should.be.false;

			u.name = 'test'
			u.validate().should.be.true;

			done();
		});
	});

	describe("Dates", function() {

		it("should know it is date", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.date('birthday', new Date());
			});

			var u = new User();
			u.validate().should.be.false;
			u.check().should.be.true;

			u.birthday = new Date();
			u.validate().should.be.true;
			u.birthday.should.be.an.instanceof(Date);

			done();
		});

		it("should know it is after a specific date", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.date('birthday').after(new Date(2003, 01, 01));
			});

			var u = new User();

			u.birthday = new Date();
			u.validate().should.be.true;


			u.birthday = new Date(1998, 01, 01);
			u.validate().should.be.false;

			done();
		});

		it("should know it is before a specific date", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.date('birthday').before(new Date(2003, 01, 01));
			});

			var u = new User();

			u.birthday = new Date();
			u.validate().should.be.false;


			u.birthday = new Date(1998, 01, 01);
			u.validate().should.be.true;

			done();
		});

		it.skip("should validate a date if the field is not required", function(done) {

			var uniqueModelName = "User_"+shortId.generate();
			var User = rodm.model(uniqueModelName, function() {
				this.date('birthday');
			});

			var u = new User();
			u.validate().should.be.true;
			u.check().should.be.true;

			done();
		});
	});
});