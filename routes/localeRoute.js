// routes/localeRoute.js

const localeController  = require('../controllers').locale;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const localeValidator 	= require('../validator/validators/localeValidator');

module.exports = function(app){

	app.get('/locales',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'locale'),
        // depthValidator.getRules(),
        // validate,
        localeController.getAll
    );

}