// services/behaviorService.js

const Behavior 			= require('../models/behavior');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	behaviors = await Behavior.find();

	return behaviors;
}