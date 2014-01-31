var assert = require('chai').assert;
var	pass = require('../pass.js');
var rules,data,validator;

describe('Pass', function(){

    it('should assert true is true', function(){
        assert.equal(true,true);
    });    

    it('should return pass as an object', function(){
    	assert.typeOf(pass, 'object');
    	assert.notTypeOf(pass,'undefined');
    });

    it('should return assert as a function', function(){
    	assert.typeOf(assert, 'function');
    	assert.notTypeOf(assert,'undefined');
    });

    it('should have 3 rules', function(){
    	rules = [
    		["first_name", "required"],
    		["last_name", "required"],
    		["email", "required"],
    	];
        assert.lengthOf(rules, 3); // just coz..
    });

    it('should validate a required field', function(){
    	rules = [
    		["first_name", "required"]
    	];
    	data = {first_name: "Billy"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	data = {first_name: ""};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate matched fields', function(){
    	rules = [
    		["password", "matches:confirm_pass"]
    	];

    	// valid
    	data = {password: "123", confirm_pass: "123"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {password: "123", confirm_pass: "1234"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    	// not valid (empty)
    	data = {password: "123", confirm_pass: ""};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate a valid email address', function(){
    	rules = [
    		["email", "valid_email"]
    	];

    	// it's not required...
    	data = {email: ""};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// valid
    	data = {email: "billyjones26@gmail.com"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {email: "billyjones26gmail.com"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate a min_length rule', function(){
    	rules = [
    		["password", "min_length:8"]
    	];

    	// valid
    	data = {password: "12345678"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

        // valid
        data = {password: "12345678910"};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

    	// not valid
    	data = {password: "123"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate a max_length rule', function(){
    	rules = [
    		["username", "max_length:10"]
    	];

    	// valid
    	data = {username: "jonesy"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {username: "billy_jones"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate an exact_length rule', function(){
    	rules = [
    		["mobile", "exact_length:11"]
    	];

    	// valid
    	data = {mobile: "07909873206"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {mobile: "079098732086"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate a greater_than rule', function(){
    	rules = [
    		["age", "greater_than:18"]
    	];

    	// valid
    	data = {age: 21};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {age: 9};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    	// incorrect type (not valid)
    	data = {age: "abc"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    });

    it('should validate a less_than rule', function(){
    	rules = [
    		["number", "less_than:100"]
    	];

    	// valid
    	data = {number: 21};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

        data = {number: "26"};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

    	// not valid
    	data = {number: 101};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

        // not valid
    	data = {number: "101"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    });

    it('should validate an alpha rule', function(){
    	rules = [
    		["first_name", "alpha"]
    	];

    	// valid
    	data = {first_name: "Billy"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {first_name: "B1lly"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    });

    it('should validate an alpha_numeric rule', function(){
    	rules = [
    		["_id", "alpha_numeric"]
    	];

    	// valid
    	data = {_id: "5200c9e0515f3bf30cd25646"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {_id: "_5200c9e0515f3bf30cd25646_"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    });

    it('should validate an alpha_dash rule', function(){
    	rules = [
    		["slug", "alpha_dash"]
    	];

    	// valid
    	data = {slug: "about-us"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {slug: "about us"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate a numeric rule', function(){
    	rules = [
    		["mobile", "numeric"]
    	];

    	// valid string
    	data = {mobile: "07909873206"};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// valid integer
    	data = {mobile: 07909873206};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// non-valid string
    	data = {mobile: "07909873206abc"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    });

    it('should validate an integer rule', function(){
    	rules = [
    		["age", "integer"]
    	];

    	// valid
    	data = {age: 26};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {age: 26.5};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());

    });

    it('should validate a decimal rule', function(){
    	rules = [
    		["total", "decimal"]
    	];

    	// valid
    	data = {total: 37.5};
    	validator = pass.validate(rules,data);
    	assert.isFalse(validator.failed());

    	// not valid
    	data = {total: "abc"};
    	validator = pass.validate(rules,data);
    	assert.isTrue(validator.failed());
    });

    it('should validate an is_natural rule', function(){
        rules = [
            ["number", "is_natural"]
        ];

        // valid
        data = {number: 100};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        // not valid
        data = {number: -100};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid
        data = {number: "abc"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());
    });

    it('should validate an is_natural_no_zero rule', function(){
        rules = [
            ["number", "is_natural_no_zero"]
        ];

        // valid
        data = {number: 100};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        // not valid
        data = {number: -100};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid
        data = {number: 0};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid
        data = {number: "abc"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());
    });   

    it('should validate a valid_ip rule', function(){
        rules = [
            ["ip_address", "valid_ip"]
        ];

        // valid
        data = {ip_address: "192.18.0.1"};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        // not valid
        data = {ip_address: "192.18.0"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

    });

    it('should validate a valid_base64 rule', function(){
        rules = [
            ["quote", "valid_base64"]
        ];

        // valid
        data = {quote: "Man is distinguished, not only by his reason, but ..."};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        // not valid
        data = {quote: "123"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

    });

    it('should validate a valid_credit_card rule', function(){
        rules = [
            ["cc", "valid_credit_card"]
        ];

        // valid string
        data = {cc: "378282246310005"};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        // valid int
        data = {cc: 378282246310005};
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        // not valid mixed
        data = {cc: "37828224631000a"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid string
        data = {cc: "37828224631"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid int
        data = {cc: 37828224631};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

    });

    it('should validate a valid_url rule', function(){
        rules = [
            ["url", "valid_url"]
        ];

        var protocols = ["http","https","ftp"];

        protocols.forEach(function(proto){
            // valid
            data = {url: proto+"://theninthnode.com"};
            validator = pass.validate(rules,data);
            assert.isFalse(validator.failed());
        });

        // not valid
        data = {url: "htp://theninthnode.com"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid
        data = {url: "theninthnode.com"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        // not valid
        data = {url: "theninthnode"};
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

    });

    it('should validate multiple rules', function(){
        
        var first_name = "Billy";
        var last_name = "Jones";
        var email = "billyjones26@gmail.com";
        var url = "http://theninthnode.com";
        var password = "12345";

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

        // valid
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        data.password = "123";

        // not valid
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

        data.password = "12345";

        // valid
        validator = pass.validate(rules,data);
        assert.isFalse(validator.failed());

        data.first_name = "";

        // not valid
        validator = pass.validate(rules,data);
        assert.isTrue(validator.failed());

    });

});