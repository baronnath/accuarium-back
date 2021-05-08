// routes/tankRoute.js

const tankController    = require('../controllers').tank;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const tankValidator 	= require('../validator/validators/tankValidator');
const urlGenerator      = require('../helpers/urlGenerator');

module.exports = function(app){

	app.post('/tank',
        userController.isLoggedIn,
        userController.isAllowedTo('createOwn', 'tank'),
        tankValidator.createRules(),
        validate,
        tankController.create
    );

	app.get('/tank',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'tank'),
        tankValidator.getRules(),
        validate,
        tankController.get
    );

    app.get('/tank/search',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'tank'),
        tankValidator.searchRules(),
        validate,
        tankController.search
    );

    app.delete('/tank',
        userController.isLoggedIn,
        userController.isAllowedTo('deleteOwn', 'tank'),
        tankValidator.deleteRules(),
        validate,
        tankController.delete
    );

    app.put('/tank/addspecies',
        userController.isLoggedIn,
        userController.isAllowedTo('createOwn', 'tank'),
        tankValidator.addSpeciesRules(),
        validate,
        tankController.addSpecies
    );

}