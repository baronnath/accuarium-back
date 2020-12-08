// routes/groupRoute.js

const groupController  = require('../controllers').group;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const userValidator 	= require('../validator/validators/groupValidator');

module.exports = function(app){

	app.get('/groups',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'group'),
        // groupValidator.getRules(),
        // validate,
        groupController.getAll
    );

}