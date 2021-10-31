// services/localeService.js

const Locale 			= require('../models/locale');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	locales = await Locale.find();

	return locales;
}