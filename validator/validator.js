// validator/validator.js

const { body, validationResult } = require('express-validator');
const {  ErrorHandler } = require('../helpers/errorHandler');
const { isPureObject } = require('../helpers/string');

// Make the real validation and return errors
const validate = (req, res, next) => {

  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  let errorMessage = ""
  errors.array().map(err => {
    if(typeof err.msg === 'object'){ // The message error may bring parameters for the translation string
      errorMessage += req.i18n.t(err.msg.path, err.msg.values) + ' ';
    } else {
      errorMessage += req.i18n.t(err.msg) + ' ';
    }
  });

  next(new ErrorHandler(422, errorMessage));
}

module.exports = {
  validate
}