// controllers/colorController.js

const Color 			= require('../models/color');
const colorService	= require('../services/behaviorService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const colors = await colorService.getAll(req, res, next);

		return res.status(200).json({
			colors
		})

	} catch (err) {
		next(err)
	}
}