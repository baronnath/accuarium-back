// validator/validators/groupValidator.js

const { body, query, oneOf, validationResult } = require('express-validator')
const User = require('../../models/user');
const Role = require('../../models/role');
const passwordLenght = 4;

exports.getRules = () => {
  return []
}

exports.deleteRules = this.getRules;
