/*
 * pass.js 1.0
 * Copyright (c) 2014 Billy Jones, http://theninthnode.com
 * pass.js is open sourced under the MIT license.
 * Thanks to validate.js for the regexes and messages.
 * http://theninthnode.github.com/pass.js
 */
(function() {

    var pass = {};
    var root = this, data, errors, valid = false;

    var messages = {
        required: 'The %s field is required.',
        matches: 'The %s field does not match the %s field.',
        valid_email: 'The %s field must contain a valid email address.',
        min_length: 'The %s field must be at least %s characters in length.',
        max_length: 'The %s field must not exceed %s characters in length.',
        exact_length: 'The %s field must be exactly %s characters in length.',
        greater_than: 'The %s field must contain a number greater than %s.',
        less_than: 'The %s field must contain a number less than %s.',
        alpha: 'The %s field must only contain alphabetical characters.',
        alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
        alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
        numeric: 'The %s field must contain only numbers.',
        integer: 'The %s field must contain an integer.',
        decimal: 'The %s field must contain a decimal number.',
        is_natural: 'The %s field must contain only positive numbers.',
        is_natural_no_zero: 'The %s field must contain a number greater than zero.',
        valid_ip: 'The %s field must contain a valid IP.',
        valid_base64: 'The %s field must contain a base64 string.',
        valid_credit_card: 'The %s field must contain a valid credit card number.',
        valid_url: 'The %s field must contain a valid URL.'
    };

    /*
     * Define the regular expressions that will be used
     */

    var ruleRegex = /^(.+?)\[(.+)\]$/,
        numericRegex = /^[0-9]+$/,
        integerRegex = /^\-?[0-9]+$/,
        decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
        emailRegex = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/,
        alphaRegex = /^[a-z]+$/i,
        alphaNumericRegex = /^[a-z0-9]+$/i,
        alphaDashRegex = /^[a-z0-9_\-]+$/i,
        naturalRegex = /^[0-9]+$/i,
        naturalNoZeroRegex = /^[1-9][0-9]*$/i,
        ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        base64Regex = /[^a-zA-Z0-9\/\+=]/i,
        numericDashRegex = /^[\d\-\s]+$/,
        urlRegex = /^((http|https|ftp):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    /**
     * - - - - - - - - - - - - - -
     * exported pass.js functions
     * - - - - - - - - - - - - - -
     */

    /**
     * Validation method. Takes in array of rules and object of data to check against
     * @param array rules
     * @param object data
     * @return object this
     */

    pass.validate = function(rules, _data){

        data = _data;
        _checkValidData(data);

        errors = []; // ensure empty error array

        // process rules
        for (var i = 0; i < rules.length; i++) {

            // rule must be at least length: 2
            if(rules[i].length < 2)
                 _throwIncorrectRuleFormat();

            var field, tests, param, message;

            field = rules[i][0].trim();
            tests = rules[i][1].split(','); // split into an array of tests

            if(typeof data[field] === 'undefined')
                _throwMissingData(field);

            // process each test
            tests.forEach(function(test){
                testSplit = test.trim().split(':'); // split into an array for using param
                test = testSplit[0].trim();
                param = testSplit[1] ? testSplit[1].trim() : testSplit[1];

                valid = _test(data[field], test, param);
                
                if(valid !== true) {
                    message = messages[test].replace('%s', (typeof rules[i][2] !== 'undefined' ? rules[i][2] : field));
                    if(typeof param !== 'undefined') {
                        message = message.replace('%s', param);
                    }
                    errors.push(message);
                }
            });
        };

        return this;
    };

    // has it failed? if error exist it has...
    pass.failed = function(){
        return (errors.length > 0);
    };

    // get the first error message
    pass.message = function(){
        return errors[0];
    };

    // get an array of all error messages
    pass.allMessages = function() {
        return errors;
    };

    /**
     * - - - - - - - - -
     * Private functions
     * - - - - - - - - -
     */

    // call appropriate test with value to test and parameter
    var _test = function (value, test, param) {
        var result;

        switch(test) {
            case "required":
                result = this._required(value, test);
                break;

            case "matches":
                if(typeof data[param] === 'undefined')
                    _throwMatchVariableNotFound(param);

                result = this._matches(value, test, data[param]);
                break;

            case "valid_email":
                result = this._validEmail(value, test);
                break;

            case "min_length":
                result = this._minLength(value, test, param);
                break;

            case "max_length":
                result = this._maxLength(value, test, param);
                break;

            case "exact_length":
                result = this._exactLength(value, test, param);
                break;

            case "greater_than":
                result = this._greaterThan(value, test, param);
                break;

            case "less_than":
                result = this._lessThan(value, test, param);
                break;

            case "alpha":
                result = this._alpha(value, test);
                break;

            case "alpha_numeric":
                result = this._alphaNumeric(value, test);
                break;

            case "alpha_dash":
                result = this._alphaDash(value, test);
                break;

            case "numeric":
                result = this._numeric(value, test);
                break;

            case "integer":
                result = this._integer(value, test);
                break;

            case "decimal":
                result = this._decimal(value, test);
                break;

            case "is_natural":
                result = this._isNatural(value, test);
                break;

            case "is_natural_no_zero":
                result = this._isNaturalNoZero(value, test);
                break;

            case "valid_ip":
                result = this._validIP(value, test);
                break;

            case "valid_base64":
                result = this._validBase64(value, test);
                break;

            case "valid_credit_card":
                result = this._validCreditCard(value, test);
                break;

            case "valid_url":
                result = this._validUrl(value, test);
                break;

            default:
                _throwUnknownRule(test);
        }

        return result;
    };

    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    String.prototype.trim = String.prototype.trim || function trim() { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

    /**
     * - - - - - - - - - 
     * Validation tests
     * - - - - - - - - -
     */

    this._required = function(value, test){
        return (value !== null && value !== '');
    };

    this._matches = function(value, test, match){
        return ((typeof match === "undefined") ? false : (value === match));
    };

    this._validEmail = function(value, test) {
        return (value === '' ? true : (emailRegex.test(value)));
    };

    this._minLength = function(value, test, min){
        return (value === '' ? true : (value.length >= parseInt(min,10)));
    };

    this._maxLength = function(value, test, max){
        return (value === '' ? true : (value.length <= parseInt(max,10)));
    };

    this._exactLength = function(value, test, length){
        return (value === '' ? true : (value.length === parseInt(length,10)));
    };

    this._greaterThan = function(value, test, size){
        return (value === '' ? true : (parseFloat(value) > parseFloat(size)));
    };

    this._lessThan = function(value, test, size){
        return (value === '' ? true : (parseFloat(value) > parseFloat(size)));
    };

    this._alpha = function(value, test) {
        return (value === '' ? true : (alphaRegex.test(value)));
    };

    this._alphaNumeric = function(value, test) {
        return (value === '' ? true : (alphaNumericRegex.test(value)));
    };

    this._alphaDash = function(value, test) {
        return (value === '' ? true : (alphaDashRegex.test(value)));
    };

    this._numeric = function(value, test) {
        return (value === '' ? true : (numericRegex.test(value)));
    };

    this._integer = function(value, test) {
        return (value === '' ? true : (integerRegex.test(value)));
    };

    this._decimal = function(value, test) {
        return (value === '' ? true : (decimalRegex.test(value)));
    };

    this._isNatural = function(value, test) {
        return (value === '' ? true : (naturalRegex.test(value)));
    };

    this._isNaturalNoZero = function(value, test) {
        return (value === '' ? true : (naturalNoZeroRegex.test(value)));
    };

    this._validIP = function(value, test) {
        return (value === '' ? true : (ipRegex.test(value)));
    };

    this._validBase64 = function(value, test) {
        return (value === '' ? true : (base64Regex.test(value)));
    };

    this._validUrl = function(value, test) {
        return (value === '' ? true : (urlRegex.test(value)));
    };

    this._validCreditCard = function(field){
        // Luhn Check Code from https://gist.github.com/4075533

        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        var strippedField = value.replace(/\D/g, "");

        for (var n = strippedField.length - 1; n >= 0; n--) {
            var cDigit = strippedField.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) === 0;
    };

    /**
     * - - - - - - - - - - - - - - - -
     * Expceptions for incorrect usage
     * - - - - - - - - - - - - - - - - 
     */

    var _throwMissingParameter = function(field){
        _throwException('Missing parameter for: ' + field);
    };

    var _throwIncorrectParameter = function(param){
        _throwException('Incorrect parameter: ' + param);
    };

    var _throwMissingData = function(variable){
        _throwException('Missing property: ' + variable);
    };

    var _throwUnknownRule = function(rule){
        _throwException('Unknown validation rule: ' + rule);
    };

    var _throwIncorrectRuleFormat = function(){
        _throwException('Incorrect validation rule format.');
    };

    var _throwIncorrectChainFunction = function(chain){
        _throwException('Incorrect chain function: ' + chain);
    };

    var _throwMatchVariableNotFound = function(variable){
        _throwException('Match variable not found: ' + variable);
    };

    var _checkValidData = function(data) {
        if(typeof data !== 'object')
            _throwException('Data is not an object.');
    };

    var _throwException = function(message) {
        throw new Error(message);
    };

    /**
     * - - - - - - - - - - - - - - 
     * Make the library accessible
     * - - - - - - - - - - - - - - 
     */

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return pass;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = pass;
    }
    // included directly via <script> tag
    else {
        root.pass = pass;
    }

}());