// controllers/permissionController.js

const permissionService	= require('../services/permissionService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const permissions = await permissionService.getAll(req, res, next);

		return res.status(200).json({
			permissions
		})

	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {

	try {
		
		permission = await permissionService.update(req, res, next);

		return res.status(200).json({
			permission,
			message: req.i18n.t('permission.update.success', {permission}),
		})
		
	} catch (err) {
		next(err)
	}
}