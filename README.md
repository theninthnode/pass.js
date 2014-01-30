pass.js
=======

Javascript validation module. Runs from server or web, doesn't need form.

**PLEASE NOTE. This project is still early stage. Tests are coming...**

## Usage

``` javascript
require('pass');

var rules,data,validator;

var first_name = "Billy";
var last_name = "Jones";
var email = "billyjones26@gmail.com";
var url = "http://theninthnode.com";
var password = "123";

rules = [
	["first_name", "required", "first name"],
	["last_name", "required", "last name"],
	["email", "required,valid_email"],
	["url", "valid_url"],
	["password", "required,min_length:5"]
];

data = {
	first_name: first_name,	
	last_name: last_name,	
	email: email,	
	url: url,	
	password: password,	
};

validator = pass.validate(rules, data);

if(validator.failed()) {
	alert(validator.message());
	return false;
}
```

## Contributions

Thanks to validate.js for the regex's and messages.

Inspired by Laravel.