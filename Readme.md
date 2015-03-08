# Overview

Sukeru is an Object Document Mapper for Riak.

# Installation

```shell
$ npm install sukeru
```

# Usage

First we need to connect to the database (localhost by default):

```javascript
sukeru.connect(function() {
    // Inside this we can define our models and do our queries...    
});
```

## Model definition

Let's define a basic User model:

```javascript
var User = sukeru.model('User', function() {
    this.string('name');
    this.string('email');
    this.string('password'); 
});
```

## Data types

The currently available data types are:
* string
* boolean
* date

## Accessing a Model

```javascript
var User = sukeru.model('User');
```

## Methods

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


## Validation

You can specify validation rules for each field this way:

```javascript
var User = sukeru.model('User', function() {
    this.string('name').required();
    this.string('email').required()
                        .email();
    this.string('password').required()
                           .minLength(6)
                           .maxLength(16); 
    this.date('birthday').required()
                           .after(new Date(2012, 01, 01))
                           .before(new Date(2015, 01, 01));
});
```

You can also pass a default value as a second argument of the property type:

```javascript
this.date('birthday', new Date());
this.string('name', 'John');
```

## Defining methods and statics

```javascript
var User = sukeru.model('User', function() {
    this.string('name_s');
    this.string('email');
    this.string('password'); 
    
    this.methods.comparePassword = function(password) {
        return (this.password === password);
    };
    this.statics.findByName = function(name, callback) {
        this.search({
            q: "name_s:"+name
        }, cb);
    };
});

// Example usage

// Static function
User.findByName("John", function(err, users) {
    // Do something here with your users
});

// Instance level methods
var user = new User();
user.email = "test";
user.password = "secret";
user.comparePassword("falsepassword"); // should be false
user.comparePassword("secret"); // should be true

```


## Search

Riak has a built-in Solr search engine. 

Solr needs a schema to define each fields name and types. By default, Riak provides us a default schema.
For strings to be indexed we need to add the suffixe: "_s" 

Let's say we want to be able to search for the name of a user. We can modify the model definition like this:
```javascript
var User = sukeru.model('User', function() {
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

> ***Note :*** For now you are only able to use the default search schema provided by Riak's Team for Solr (thus the suffix "_s")


