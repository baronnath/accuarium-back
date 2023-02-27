const express					= require('express');
const app						= express();
const server					= require('http').Server(app);
const port						= process.env.PORT || 8080;
const env						= process.env.NODE_ENV || 'development';
const config					= require(__dirname + '/config/server')[env];
const dotenv					= require('dotenv');
const bodyParser				= require('body-parser');
const i18next					= require("i18next");
const i18nextMiddleware 		= require('i18next-http-middleware')
const Backend					= require("i18next-fs-backend");
const translatorConfig			= require(__dirname + '/config/translator');
const { 
	logger,
	httpLogger
}								= require('./helpers/logger');
const accessControl				= require('./helpers/accessControl');
const {
	handleError,
	ErrorHandler
}								= require('./helpers/errorHandler');
const mongoose 					= require('mongoose');
const mongooseConfig			= require(__dirname + '/config/mongoose');
const cors						= require('cors');

// Add env variables from .env file
dotenv.config();

// MongoDB connection
mongoose.set("strictQuery", false); // This line is becuase of a DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7
mongoose.connect(process.env["database_connection_string_" + env], mongooseConfig)
.catch(err => {
	logger.api(err.message);
});

// app.use(express.json()); // transform all request in json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: config.uploadMaxSize }))

app.use(cors({
	'origin': config.allowOrigins
}));

// Register static directory
app.use(express.static(`${__dirname}/public`));

// Initialize translator
i18next
	.use(i18nextMiddleware.LanguageDetector)
	.use(Backend)
	.init(translatorConfig);
app.use(
	i18nextMiddleware.handle(i18next)
);

// Initialize access control (permissions system)
accessControl.init();

// // HTTP request logger
app.use(httpLogger);

// Routes
require('./routes')(app); // Load our routes and pass in our app


// Error handle middleware
app.use((err, req, res, next) => {
  	handleError(err, req, res);
});

// Launch ======================================================================
server.listen(port, err => {
    if (err) {
		handleError(err);
    };

	logger.debug(`
		====================================
		🛡️  Server listening on port: ${port} 🛡️ 
		====================================
	`);
});