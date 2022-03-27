// validator/validators/compatibilityValidator.js

const { body, param, query, oneOf, validationResult } = require('express-validator')
const User = require('../../models/user');
const Species = require('../../models/species');
const Compatibility = require('../../models/compatibility');

exports.createRules = () => {
  return [
    body('compatibilityId')
    .optional()
    .custom(value => {
        return Compatibility.findById(value).then(type => {
            if (!type) {
              return Promise.reject('validation.compatibility.notExists')
            }
        })
    }),
   	body(['speciesAId','speciesBId'])
        .optional()
        .custom(value => {
            return Species.findById(value).then(species => {
                if (!species) {
                  return Promise.reject('validation.species.notExists')
                }
            })
        }),
    body('warningId')
    	.optional()
     	.isArray().withMessage('validation.warning.notArray'),
    body('warningId.*')
        .optional()
        .custom(value => {
            Warning.findById(value).then(warning => {
                if (!warning) {
                  return Promise.reject('validation.warning.notExists')
                }
            })
        }),
  ]
}

exports.getRules = () => {
  return [
    oneOf([
        query('compatibilityId').exists(),
        query('tankId').exists(),
        [query('speciesAId').exists(),query('speciesBId').exists()]
    ],
    'validation.requestData.required'),
    query('compatibilityId')
        .if(query('tankId').not().exists())
        .if(query('speciesAId').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    query('tankId')
        .if(query('compatibilityId').not().exists())
        .if(query('speciesAId').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    query('speciesAId')
        .if(query('compatibilityId').not().exists())
        .if(query('tankId').not().exists())
        .isHexadecimal().withMessage('validation.id.format'),
    query('speciesBId')
        .if(query('speciesAId').exists())
        .isHexadecimal().withMessage('validation.id.format'),
  ]
}

exports.deleteRules = this.getRules;

// exports.searchRules = () => {
//   return [
//     query('page')
//         .optional()
//         .isNumeric().withMessage('validation.notNumber'),
//     query('direction')
//         .optional()
//         .custom(value => {
//             return (value == 'ascending' || value =='descending');
//         }).withMessage('validation.search.order.notValid'),
//   ]
// }

exports.uploadFileRules = () => {
  return []
}


