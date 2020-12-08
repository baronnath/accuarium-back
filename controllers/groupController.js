// controllers/groupController.js

const Group 			= require('../models/group');
const groupService		= require('../services/groupService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
		const groups = await groupService.getAll(req, res, next);

		return res.status(200).json({
			groups
		})

	} catch (err) {
		next(err)
	}
}
