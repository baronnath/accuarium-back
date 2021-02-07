// routes/compatibilityRoute.js

const compatibilityController = require('../controllers').compatibility;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const compatibilityValidator 	= require('../validator/validators/compatibilityValidator');
const urlGenerator      = require('../helpers/urlGenerator');

module.exports = function(app){

	app.post('/compatibility',
        userController.isLoggedIn,
        userController.isAllowedTo('createAny', 'compatibility'),
        // compatibilityValidator.createRules(),
        // validate,
        compatibilityController.create
    );

	app.get('/compatibility',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'compatibility'),
        // compatibilityValidator.getRules(),
        // validate,
        compatibilityController.get
    );

    // app.get('/compatibility/search',
    //     userController.isLoggedIn,
    //     userController.isAllowedTo('readAny', 'compatibility'),
    //     compatibilityValidator.searchRules(),
    //     validate,
    //     compatibilityController.search
    // );

}