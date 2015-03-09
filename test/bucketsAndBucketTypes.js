var should = require('should');
var sukeru = require('../');

describe("Buckets", function() {
	var Person;

	before(function(done) {
		sukeru.connect('http', function() {
			Person = sukeru.model("Person", function() {
				this.bucket('person', {
					allow_mult: false
				});
				this.string('name_s');
				this.string('password');
			});
			done();
		});
		
	});
	it("should save props", function(done) {
		var p = new Person();
		p.bucket.saveProps(function(err, props) {
			if(err)
				console.log(err);
			p.bucket.getProps(function(err, props) {
				should.not.exist(err);
				should.exist(props);
				done();
			});
		});
	});
	it("should set a bucket name", function(done) {
		var p = new Person();
		p.name_s = "Patrick";
		p.password = "Johnson";
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