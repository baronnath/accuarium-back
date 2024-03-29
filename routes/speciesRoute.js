// routes/speciesRoute.js

const speciesController = require('../controllers').species;
const userController  	= require('../controllers').user;
const { validate } 		= require('../validator/validator');
const speciesValidator 	= require('../validator/validators/speciesValidator');
const urlGenerator      = require('../helpers/urlGenerator');
const multer            = require('../helpers/multer');

const upload = multer(urlGenerator.getUploadsUrl());

module.exports = function(app){

	app.post('/species',
        userController.isLoggedIn,
        userController.isAllowedTo('createAny', 'species'),
        // upload.single('image'),
        // speciesValidator.createRules(),
        // validate,
        speciesController.create
    );

	app.get('/species',
        // userController.isLoggedIn,
        // userController.isAllowedTo('readAny', 'species'),
        speciesValidator.getRules(),
        validate,
        speciesController.get
    );

    app.get('/species/search',
        // userController.isLoggedIn,
        // userController.isAllowedTo('readAny', 'species'),
        speciesValidator.searchRules(),
        validate,
        speciesController.search
    );

    app.post('/species/uploadFile',
        userController.isLoggedIn,
        userController.isAllowedTo('createAny', 'species'),
        upload.single('file'),
        // speciesValidator.uploadFileRules(),
        // validate,
        speciesController.uploadFile
    );

}