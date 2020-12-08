// services/groupService.js

const Group 			= require('../models/group');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	groups = await Group.find();

	return groups;
}