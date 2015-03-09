var sukeru = require('../');

sukeru.connect(function() {
	var User = sukeru.model('User', function() {
		this.string('name_s');
		this.string('email').required();
		this.string('password').required();
	});

	var john = new User();
	john.name_s = "John";
	john.email = "john@example.com";
	john.password = "my secret password";
	john.save(function(err) {
		if(err)
			return console.log(err);
		console.log("The user has been successfully created", john);
		console.log("It should have a new generated id:", john.id);



		User.search({
			q: "name_s:John",
			rows: 10
		}, function(err, users) {
			if(err)
				return console.log('Error:', err);
			console.log("Here we have our results", users);
		});
	});
});



