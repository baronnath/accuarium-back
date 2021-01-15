// validator/validators/tankValidator.js

const { body, param, query, oneOf, validationResult } = require('express-validator')
const User = require('../../models/user');
const Family = require('../../models/family');
const Type = require('../../models/type');
const Depth = require('../../models/depth');
const Feed = require('../../models/feed');
const Behavior = require('../../models/behavior');
const Species = require('../../models/species');

exports.createRules = () => {
  return [
  	body('name')
        .not().isEmpty().withMessage('validation.name.required')
        .custom(value => {
            return Species.findOne({name: value}).then(tank => {
                if (tank) {
                  return Promise.reject('validation.tank.name.alreadyExists')
                }
            })
        }),
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
            console.log(speciesId);
            return Species.findById(speciesId).then(species => {
                if (!species) {
                  return Promise.reject('validation.species.notExists')
                }
            })
        }),
    body('width')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('1validation.notNumber'),
    body('height')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('2validation.notNumber'),
    body('length')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('3validation.notNumber'),
    body('liters')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('4validation.notNumber'),
  ]
}

exports.getRules = () => {
  return []
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


