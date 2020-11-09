// routes/typeRoute.js

const typeController  = require('../controllers').type;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const typeValidator 	= require('../validator/validators/typeValidator');

module.exports = function(app){

	app.get('/types',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'type'),
        // depthValidator.getRules(),
        // validate,
        typeController.getAll
    );

}