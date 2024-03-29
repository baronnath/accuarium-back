// helpers/errorHandler.js

const env 			= process.env.NODE_ENV || 'development';
const { logger }    = require('./logger');

// Error class extension
exports.ErrorHandler = class ErrorHandler extends Error {
  constructor(statusCode, message, data) {
    super();
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.message = message;
    this.data = data;
  }
}
// exports.ErrorHandler = class ErrorHandler extends Error {
// 	constructor(statusCode, message) {
// 		super(message);
// 		this.statusCode = statusCode;
// 		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
// 		this.message = message;
// 	}
// }

// Error handler
exports.handleError = (err, req, res) => {

  	err.statusCode = err.statusCode || 500;
  	err.status = err.status || 'error';

  	if (env === 'development') {
	    sendErrorDev(err, req, res);
  	} else if (env === 'production') {
	    sendErrorProd(err, res);
  	}
};

const sendErrorDev = (err, req, res) => {
	err.message = req.i18n.t(err.message) + (err.data ? ': ' + err.data : '' );
	logger.error(err.statusCode + ' - ' + err.message);

	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err, req, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
};