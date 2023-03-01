// services/permissionService.js

const Permission 		= require('../models/permission');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 	= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	const permissions = await Permission.find().populate('role').populate('endPoint');

	return permissions;
}

exports.update = async (req, res, next) => {
	const { permissionId, grant, value } = req.body;
	let permission = null;

	permission = await Permission
		.findById(permissionId);

	if(!permission)
		throw new ErrorHandler(400, 'validation.permission.notExists');

	permission.grants[grant] = value;

	return await permission.save();
}