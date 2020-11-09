// controllers/depthController.js

const Depth 				= require('../models/depth');
const depthService		= require('../services/depthService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const depths = await depthService.getAll(req, res, next);

		return res.status(200).json({
			depths
		})

	} catch (err) {
		next(err)
	}
}
