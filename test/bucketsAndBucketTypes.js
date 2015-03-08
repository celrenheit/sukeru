var should = require('should');
var rodm = require('../');

describe("Buckets", function() {
	var Person;

	before(function(done) {
		rodm.connect('http', function() {
			Person = rodm.model("Person", function() {
				this.bucket('person', {
					allow_mult: false
				})
				this.string('name_s');
				this.string('password');
			});
			done();
		});
		
	});
	it("should save props", function(done) {
		var p = new Person();
		p.bucket.saveProps(function(err, props) {
			console.log(err, props);
			done();
		});
	});
	it("should set a bucket name", function(done) {
		var p = new Person();
		p.name_s = "Patrick";
		p.password = "Johnson";
		console.log(p.bucket.props);
		p.save(function(err) {
			p.bucket.name.should.equal("person");
			p.bucket.props.allow_mult.should.be.false;
			// p.bucketType.name.should.equal("searchable");
		
			done();
		});
	});

	it("should search for a person", function(done) {
		Person.search({
			name_s: "Patrick"
		}, function (err, persons) {
			console.log(persons);
			done();
		});
	});
});