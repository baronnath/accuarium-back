// controllers/typeController.js

const Type 				= require('../models/type');
const typeService		= require('../services/typeService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const types = await typeService.getAll(req, res, next);

		return res.status(200).json({
			types
		})

	} catch (err) {
		next(err)
	}
}
