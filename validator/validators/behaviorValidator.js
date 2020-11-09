// validator/validators/behaviorValidator.js

const { body, query, oneOf, validationResult } = require('express-validator')
const User = require('../../models/user');
const Role = require('../../models/role');

exports.getRules = () => {
  return []
}

exports.deleteRules = this.getRules;
