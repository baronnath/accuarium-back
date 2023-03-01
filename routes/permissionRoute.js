// routes/permissionRoute.js

const permissionController  = require('../controllers').permission;
const userController  	= require('../controllers').user;
// const { validate } 		= require('../validator/validator');
// const permissionValidator 	= require('../validator/validators/permissionValidator');

module.exports = function(app){

	app.get('/permissions',
    userController.isLoggedIn,
    userController.isAllowedTo('readAny', 'permission'),
    // permissionValidator.getRules(),
    // validate,
    permissionController.getAll
  );

  app.put('/permission',
    userController.isLoggedIn,
    userController.isAllowedTo('updateAny', 'permission'),
    // permissionValidator.getRules(),
    // validate,
    permissionController.update
  );

}