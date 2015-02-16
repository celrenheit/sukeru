# Overview

Rodm is an Object Document Mapper for Riak.

# Usage

First we need to connect to the database (localhost by default):

```javascript
var User = rodm.connect(function() {
    // Inside this we can define our models and do our queries...    
});
```



Let's define a basic User model:

```javascript
var User = rodm.model('User', function() {
    this.string('name')
    this.string('email');
    this.string('password'); 
});
```

Now that the User model is created, we can create a new user and than save it to the database:

```javascript
var john = new User();
john.name = "John";
john.email = "john@example.com";
john.password = "my secret password";
john.save(function(err) {
    if(err)
        return console.log(err);
    console.log("The user has been successfully created", john);
    console.log("It should have a new generated id:", john.id);
});
```

Let's find a user by id:

```javascript
User.findById("aNIdToFind", function(err, user) {
    if(err)
        return console.log(err);
    console.log("A user was found", user);
});
```

To delete this user: 
```javascript
john.remove(function(err) {
   console.log("John should not exist anymore in the database");
});
```

To delete a user by its id: 
```javascript
User.delete("aNIdToDelete", function(err) {
   console.log("This user should not exist anymore in the database");
});
```


## Search

Riak has a built-in Solr search engine. 

Solr needs a schema to define each fields name and types. By default, Riak provides us a default schema.
For strings to be indexed we need to add the suffixe: "_s" 

Let's say we want to be able to search for the name of a user. We can modify the model definition like this:
```javascript
var User = rodm.model('User', function() {
    this.string('name_s')
    this.string('email');
    this.string('password'); 
});
```

To search for an object we can run a Solr query:
```javascript
User.search({
    q: "name_s:John",
    rows: 10
}, function(err, users) {
    console.log("Here we have our results", users)
});
```




