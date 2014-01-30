pass.js
=======

Javascript validation module. Runs from server or web, doesn't need a form.

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

## Available Rules

* required
* matches
* valid_email
* min_length
* max_length
* exact_length
* greater_than
* less_than
* alpha
* alpha_numeric
* alpha_dash
* numeric
* integer
* decimal
* is_natural
* is_natural_no_zero
* valid_ip
* valid_base64
* valid_credit_card
* valid_url

## Contributions

Thanks to validate.js for the regex's and messages.

Inspired by Laravel's validator class.

Trim function - http://blog.stevenlevithan.com/archives/faster-trim-javascript