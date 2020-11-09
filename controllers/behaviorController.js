// controllers/behaviorController.js

const Behavior 			= require('../models/behavior');
const behaviorService	= require('../services/behaviorService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const behaviors = await behaviorService.getAll(req, res, next);

		return res.status(200).json({
			behaviors
		})

	} catch (err) {
		next(err)
	}
}