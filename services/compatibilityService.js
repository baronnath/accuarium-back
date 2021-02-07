// services/compatibilityService.js

const fs 			= require('fs');
const Compatibility 		= require('../models/compatibility');
const Type 			= require('../models/type');
const Family 		= require('../models/family');
const Feed 			= require('../models/feed');
const Depth 		= require('../models/depth');
const Behavior 		= require('../models/behavior');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 	= require('../helpers/logger');
const config		= require('../config/preferences'); 
const urlGenerator  = require('../helpers/urlGenerator');

const imageUrl = urlGenerator.getImagesUrl() + 'compatibility/';

exports.create = async (req, res, next) => {

	const { 
		speciesAId,
		speciesBId,
		compatibility,
		warnings

	} = req.body;

	compatibility = new Compatibility({
		speciesA: speciesAId,
		speciesB: speciesBId,
		compatibility,
		warnings
	});

	return await compatibility.save();
}

exports.get = async (req, res, next) => {
	const { 
		compatibilityId,
		speciesAId,
		speciesBId
	} = req.query;

	if(compatibilityId){
		compatibility = await Compatibility
			.findById(compatibilityId);
	}
	else{
		compatibility = await Compatibility
			.findOne.find({
			      $and: [
			          { $or: [{speciesA: speciesAId}, {speciesA: speciesBId}] },
			          { $or: [{speciesB: speciesAId}, {speciesB: speciesBId}] }
			      ]
		  	})
	}

	if(!compatibility) {
		throw new ErrorHandler(404, 'compatibility.notFound');
	}

	return compatibility

}
 
exports.getAll = async (req, res, next) => {

	compatibility = await Compatibility.find().limit(50);

	return compatibility;
}

exports.update = async (req, res, next) => {
	const {
		compatibilityId,
		compatibility,
		warnings
	} = req.body;

	if(compatibilityId){
		compatibility = await Compatibility
			.findById(compatibilityId);
	}

	if(compatibility){
		compatibility.compatibility = compatibility;
	}
	if(warnings){
		compatibility.warnings = warnings;
	}

	return await compatibility.save();
}

// exports.search = async (req, res, next) => {

// 	const keyword = req.query.keyword;
// 	let field = req.query.sort;
// 	let direction = req.query.direction;
// 	let page = req.query.page;
// 	const perPage = config.pagination;
// 	let criteria = {};

// 	if(!field){
// 		field = 'name';
// 	}
// 	if(!direction){
// 		direction = 'ascending';
// 	}

// 	if(!page){
// 		page = 0;
// 	}

// 	if(keyword){
// 		const regex = new RegExp(keyword, 'i');
// 		criteria = {
// 			$or: [ {name : { $regex: regex }}, { otherNames: { $regex: regex } } ]
// 		}
// 	}

// 	compatibility = await Compatibility
// 		.find(criteria)
// 		.sort({[field]: direction})
// 		.skip(perPage * page)
//     	.limit(perPage);

//    	total = await Compatibility
// 		.find(criteria)
// 		.count();

// 	return {
// 		compatibility,
// 		total
// 	}

// }
