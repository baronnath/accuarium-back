// routes/behaviorRoute.js

const behaviorController  = require('../controllers').behavior;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const behaviorValidator 	= require('../validator/validators/behaviorValidator');

module.exports = function(app){

	app.get('/behaviors',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'behavior'),
        // depthValidator.getRules(),
        // validate,
        behaviorController.getAll
    );

}