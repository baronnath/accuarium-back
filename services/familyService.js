// services/familyService.js

const Family 			= require('../models/family');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	families = await Family.find();

	return families;
}