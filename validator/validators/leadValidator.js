// validator/validators/leadValidator.js

const { body, oneOf } = require('express-validator')
const Lead = require('../../models/lead');
const passwordLenght = 4;

exports.createRules = () => {
  return [
    body('email')
    	.isEmail().withMessage('validation.email.format')
    	.not().isEmpty().withMessage('validation.email.required')
    	.custom(value => {
		  	return Lead.findOne({email: value}).then(lead => {
			    if (lead) {
			      return Promise.reject('validation.email.exists')
			    }
			})
	  	}),
    body('locale')
        .not().isEmpty().withMessage('validation.name.required'),
  ]
}

exports.getRules = () => {
  return [
    oneOf([
        body('leadId').exists(),
        body('email').exists()
    ],
    'validation.emailOrId.required'),
    body('leadId')
        .if(body('email').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    body('email')
        .if(body('leadId').not().exists())
        .isEmail().withMessage('validation.email.format')
        .custom(value => {
            return Lead.findOne({email: value}).then(lead => {
                if (!lead) {
                  return Promise.reject('validation.lead.notExists')
                }
            })
        })
  ]
}

exports.updateRules = () => {
  return [
    oneOf([
        body('leadId').exists(),
        body('email').exists()
    ],
    'validation.emailOrId.required'),
    body('leadId')
        .if(body('email').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    body('email')
        .if(body('leadId').not().exists())
        .isEmail().withMessage('validation.email.format')
        .custom(value => {
            return Lead.findOne({email: value}).then(lead => {
                if (!lead) {
                  return Promise.reject('validation.lead.notExists')
                }
            })
        }),
    ]
}

exports.deleteRules = this.getRules;