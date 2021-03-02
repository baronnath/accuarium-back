// routes/colorRoute.js

const colorController  = require('../controllers').color;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const colorValidator 	= require('../validator/validators/colorValidator');

module.exports = function(app){

	app.get('/colors',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'color'),
        // colorValidator.getRules(),
        // validate,
        colorController.getAll
    );

}