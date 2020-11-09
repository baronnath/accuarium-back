// routes/feedRoute.js

const feedController  = require('../controllers').feed;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const feedValidator 	= require('../validator/validators/feedValidator');

module.exports = function(app){

	app.get('/feeds',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'feed'),
        // depthValidator.getRules(),
        // validate,
        feedController.getAll
    );

}