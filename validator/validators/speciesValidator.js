// validator/validators/speciesValidator.js

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
            return Species.findOne({name: value}).then(species => {
                if (species) {
                  return Promise.reject('validation.species.name.alreadyExists')
                }
            })
        }),
  	body('typeId')
        .optional()
        .custom(value => {
            return Type.findById(value).then(type => {
                if (!type) {
                  return Promise.reject('validation.type.notExists')
                }
            })
        }),
  	body('familyId')
        .optional()
        .custom(value => {
            return Family.findById(value).then(family => {
                if (!family) {
                  return Promise.reject('validation.family.notExists')
                }
            })
        }),
    body('depthId')
        .optional()
        .custom(value => {
            return Depth.findById(value).then(depth => {
                if (!depth) {
                  return Promise.reject('validation.depth.notExists')
                }
            })
        }),
    body('feedIds')
    	.optional()
    	.isArray().withMessage('validation.feed.notArray'),
    body('feedIds.*')
        .optional()
        .custom(value => {
            return Feed.findById(value).then(feed => {
                if (!feed) {
                  return Promise.reject('validation.feed.notExists')
                }
            })
        }),
    body('behaviorId')
    	.optional()
     	.isArray().withMessage('validation.behavior.notArray'),
    body('behaviorId.*')
        .optional()
        .custom(value => {
            Behavior.findById(value).then(behavior => {
                if (!behavior) {
                  return Promise.reject('validation.behavior.notExists')
                }
            })
        }),
    body('temperature')
        .optional()
        .isNumeric().withMessage('validation.notNumber'),
    body('minPh')
        .isNumeric().withMessage('validation.notNumber')
        .custom(value => {
            return (value >= 1 && value <= 14);
        }).withMessage('validation.ph.notValid'),
    body('maxPh')
        .optional()
        .isNumeric().withMessage('validation.notNumber')
        .custom(value => {
            return (value >= 1 && value <= 14);
        }).withMessage('validation.ph.notValid'),
    body('lenght')
        .optional()
        .isNumeric().withMessage('validation.notNumber'),
    body('volumeSpecimen')
        .optional()
        .isNumeric().withMessage('validation.notNumber'),
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

exports.uploadFileRules = () => {
  return []
}


