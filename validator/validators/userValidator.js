// validator/validators/userValidator.js

const { body, query, oneOf, validationResult } = require('express-validator')
const User = require('../../models/user');
const Role = require('../../models/role');
const passwordLenght = 4;

exports.createRules = () => {
  return [
    body('email')
    	.isEmail().withMessage('validation.email.format')
    	.not().isEmpty().withMessage('validation.email.required')
    	.custom(value => {
		  	return User.findOne({email: value}).then(user => {
			    if (user) {
			      return Promise.reject('validation.email.exists')
			    }
			})
	  	}),
    body('password')
    	.not().isEmpty().withMessage('validation.password.required')
    	.isLength({ min: passwordLenght }).withMessage({
            'path': 'validation.password.lenght',
            'values': {passwordLenght}
        }),
    body('role')
        .optional()
        .custom(value => {
            return Role.findOne({name:value}).then(role => {
                if (!role) {
                  return Promise.reject('validation.role.notExists')
                }
            })
        }),
    body('name')
        .not().isEmpty().withMessage('validation.name.required'),
  ]
}

exports.getRules = () => {
  return [
    oneOf([
        body('userId').exists(),
        body('email').exists()
    ],
    'validation.emailOrId.required'),
    body('userId')
        .if(body('email').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    body('email')
        .if(body('userId').not().exists())
        .isEmail().withMessage('validation.email.format')
        .custom(value => {
            return User.findOne({email: value}).then(user => {
                if (!user) {
                  return Promise.reject('validation.user.notExists')
                }
            })
        })
    ]
}

exports.updateRules = () => {
  return [
    oneOf([
        body('userId').exists(),
        body('email').exists()
    ],
    'validation.emailOrId.required'),
    body('userId')
        .if(body('email').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    body('email')
        .if(body('userId').not().exists())
        .isEmail().withMessage('validation.email.format')
        .custom(value => {
            return User.findOne({email: value}).then(user => {
                if (!user) {
                  return Promise.reject('validation.user.notExists')
                }
            })
        }),
    body('password')
        .optional()
        .isLength({ min: passwordLenght }).withMessage('validation.password.lenght', {passwordLenght}),
    body('role')
        .optional()
        .custom(value => {
            return Role.findOne({name:value}).then(role => {
                if (!role) {
                  return Promise.reject('validation.role.notExists')
                }
            })
        }),
    ]
}

exports.deleteRules = this.getRules;

exports.loginRules = () => {
  return [
    body('email')
        .isEmail().withMessage('validation.email.format')
        .not().isEmpty().withMessage('validation.email.required')
        .custom(value => {
            return User.findOne({email: value}).then(user => {
                if (!user) {
                  return Promise.reject('validation.user.notExists')
                }
            })
        }),
    body('password')
        .not().isEmpty().withMessage('validation.passwrod.required')
        .isLength({ min: passwordLenght }).withMessage('validation.password.lenght', {passwordLenght}),
  ]
}

exports.verifyRules = () => {
  return [
    body('email')
    	.isEmail().withMessage('validation.email.format')
    	.not().isEmpty().withMessage('validation.email.required')
    	.custom(value => {
		  	return User.findOne({email: value}).then(user => {
			    if (!user) {
			      return Promise.reject('validation.email.notExists')
			    }
			})
	  	}),
    body('confirmationToken')
    	.not().isEmpty().withMessage('validation.confirmationToken.required')
  ]
}

exports.resendRules = () => {
  return [
    query('email')
        .isEmail().withMessage('validation.email.format')
        .not().isEmpty().withMessage('validation.email.required')
        .custom(value => {
              return User.findOne({email: value}).then(user => {
                if (!user) {
                  return Promise.reject('validation.email.notExists')
                }
            })
        })
  ]
}