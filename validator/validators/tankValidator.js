// validator/validators/tankValidator.js

const { body, param, query, oneOf, validationResult } = require('express-validator')
const User = require('../../models/user');
const Family = require('../../models/family');
const Type = require('../../models/type');
const Depth = require('../../models/depth');
const Feed = require('../../models/feed');
const Behavior = require('../../models/behavior');
const Species = require('../../models/species');
const Tank = require('../../models/tank');

exports.createRules = () => {
  return [
  	body('name')
        .not().isEmpty().withMessage('validation.name.required'),
  	body('userId')
        .optional({ checkFalsy: true })
        .custom(value => {
            return User.findById(value).then(user => {
                if (!user) {
                  return Promise.reject('validation.user.notExists')
                }
            })
        }),
    body('species')
    	.optional()
    	.isArray().withMessage('validation.species.notArray'),
    body('species.*')
        .optional()
        .custom(speciesId => {
            return Species.findById(speciesId).then(species => {
                if (!species) {
                  return Promise.reject('validation.species.notExists')
                }
            })
        }),
    body('width')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
    body('height')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
    body('length')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
    body('liters')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
  ]
}

exports.getRules = () => {
    return [
        oneOf(
            [
                query('tankId').exists(),
                query('userId').exists()
            ],
            'validation.tankIdOrUserId.required'
        ),
        query('tankId')
            .if(query('userId').not().exists())
            .isHexadecimal().withMessage('validation.id.format'),
        query('userId')
            .if(query('tankId').not().exists())
            .isHexadecimal().withMessage('validation.id.format'),
    ]
}

exports.updateRules = () => {
  return [
    body('tankId')
        .custom(value => {
            return Tank.findById(value).then(tank => {
                if (!tank) {
                  return Promise.reject('validation.tank.notExists')
                }
            })
        }),
    body('species')
        .optional()
        .isArray().withMessage('validation.species.notArray'),
    body('species.*')
        .optional()
        .custom(species => {
            return Species.findById(species.species).then(sp => {
                if (!sp) {
                  return Promise.reject('validation.species.notExists')
                }
            })
        }),
    body('width')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
    body('height')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
    body('length')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
    body('liters')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('validation.notNumber'),
  ]
}

exports.deleteRules = this.getRules;

exports.searchRules = () => {
  return [
    query('page')
        .optional()
        .isNumeric().withMessage('validation.notNumber'),
    query('direction')
        .optional()
        .custom(value => {
            return (value == 'ascending' || value =='descending');
        }).withMessage('validation.search.order.notValid'),
  ]
}

exports.addSpeciesRules = () => {
    return [
        body('tankId')
            .custom(value => {
                return Tank.findById(value).then(tank => {
                    if (!tank) {
                      return Promise.reject('validation.tank.notExists')
                    }
                })
            }),
        body('species')
            .exists().withMessage('validation.species.required'),
        body('species').isArray().withMessage('validation.species.notArray'),
        body("species.*.species")
            .custom(value => {
                return Species.findById(value).then(species => {
                    if (!species) {
                      return Promise.reject('validation.species.notExists')
                    }
                })
            }),
        body("species.*.quantity")
            .optional()
            .isNumeric().withMessage('validation.notNumber'),
        body("species.*.main")
            .optional({ checkFalsy: true })
            .isBoolean().withMessage('validation.notBoolean'),
    ]
}


