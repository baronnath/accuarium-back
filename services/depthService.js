// services/depthService.js

const Depth 			= require('../models/depth');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	depths = await Depth.find();

	return depths;
}