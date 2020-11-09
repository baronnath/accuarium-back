// services/feedService.js

const feed 			= require('../models/feed');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');

exports.getAll = async (req, res, next) => {

	feeds = await feed.find();

	return feeds;
}