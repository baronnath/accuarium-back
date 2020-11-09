// services/typeService.js

const Type 			= require('../models/type');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	types = await Type.find();

	return types;
}