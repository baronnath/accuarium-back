// services/colorService.js

const Color 		= require('../models/color');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 	= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	colors = await Color.find();

	return colors;
}