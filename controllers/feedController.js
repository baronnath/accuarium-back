// controllers/feedController.js

const feed 				= require('../models/feed');
const feedService		= require('../services/feedService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const feeds = await feedService.getAll(req, res, next);

		return res.status(200).json({
			feeds
		})

	} catch (err) {
		next(err)
	}
}
