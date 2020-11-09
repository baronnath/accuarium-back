// routes/familyRoute.js

const familyController  = require('../controllers').family;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const userValidator 	= require('../validator/validators/familyValidator');

module.exports = function(app){

	app.get('/families',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'family'),
        // familyValidator.getRules(),
        // validate,
        familyController.getAll
    );

}