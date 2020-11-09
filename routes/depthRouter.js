// routes/depthRoute.js

const depthController  = require('../controllers').depth;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const depthValidator 	= require('../validator/validators/depthValidator');

module.exports = function(app){

	app.get('/depths',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'depth'),
        // depthValidator.getRules(),
        // validate,
        depthController.getAll
    );

}