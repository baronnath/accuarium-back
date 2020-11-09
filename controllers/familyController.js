// controllers/familyController.js

const Family 				= require('../models/family');
const familyService		= require('../services/familyService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const families = await familyService.getAll(req, res, next);

		return res.status(200).json({
			families
		})

	} catch (err) {
		next(err)
	}
}
