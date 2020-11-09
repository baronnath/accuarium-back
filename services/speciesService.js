// services/speciesService.js

const Species 		= require('../models/species');
const Type 			= require('../models/type');
const Family 		= require('../models/family');
const Feed 			= require('../models/feed');
const Depth 		= require('../models/depth');
const Behavior 		= require('../models/behavior');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 	= require('../helpers/logger');
const config		= require('../config/preferences'); 

exports.create = async (req, res, next) => {

	console.log(req.file);

	const { 
		name,
		image,
		typeId,
		familyId,
		minTemperature,
		maxTemperature,
		minPh,
		maxPh,
		literSpecimen,
		lenght,
		feedId,
		varietyOfId,
		depthId,
		behaviorId
	} = req.body;

	species = new Species({
		name: name,
		image: image,
		type: typeId,
		family: familyId,
		parameters: {
			temperature: {
				min: minTemperature,
				max: maxTemperature
			},
			ph: {
				min: minPh,
				max: maxPh
			}
		},
		literSpecimen: literSpecimen,
		lenght: lenght,
		feed: feedId,
		varietyOf: varietyOfId,
		depth: depthId,
		behavior: behaviorId
	});

	return await species.save();
}

exports.getAll = async (req, res, next) => {

	species = await Species.find();

	return species;
}

exports.update = async (req, res, next) => {
	const {
		speciesId,
		name,
		image,
		typeId,
		familyId,
		minTemperature,
		maxTemperature,
		minPh,
		maxPh,
		literSpecimen,
		lenght,
		feedId,
		varietyOfId,
		depthId,
		behaviorId
	} = req.body;

	if(speciesId){
		species = await Species
			.findById(speciesId);
	}

	if(name){
		species.name = name;
	}
	if(image){
		species.image = image;
	}
	if(typeId){
		species.typeId = typeId;
	}
	if(temperature){
		if(maxTemperature)
			species.parameters.temperature.max = maxTemperature;
		if(mimTemperature)
			species.parameters.temperature.min = minTemperature;
	}
	if(ph){
		if(maxPh)
			species.parameters.ph.max = maxPh
		if(mimPh)
			species.parameters.ph.min = minPh;
	}
	if(literSpecimen){
		species.literSpecimen = literSpecimen;
	}
	if(lenght){
		species.lenght = lenght;
	}

	if(familyId){
		family = await Family
			.findOne(familyId);

		species.family = family;
	}

	if(feedId){
		feed = await Feed
			.findOne(feedId);

		species.feed = feed;
	}

	if(varietyOfId){
		varietyOf = await Species
			.findOne(varietyOfId);

		species.varietyOf = varietyOf;
	}

	if(depthId){
		depth = await Depth
			.findOne(depthId);

		species.depth = depth;
	}

	if(behaviorId){
		behavior = await Behavior
			.findOne(behaviorId);

		species.behavior = behavior;
	}

	return await species.save();
}

exports.search = async (req, res, next) => {

	const keyword = req.query.keyword;
	let field = req.query.sort;
	let direction = req.query.direction;
	let page = req.query.page;
	const perPage = config.pagination;
	let criteria = {};

	if(!field){
		field = 'name';
	}
	if(!direction){
		direction = 'ascending';
	}

	if(!page){
		page = 0;
	}
	console.log(page);

	if(keyword){
		const regex = new RegExp(keyword, 'i');
		criteria = {
			$or: [ {name : { $regex: regex }}, { otherNames: { $regex: regex } } ]
		}
	}

	species = await Species
		.find(criteria)
		.sort({[field]: direction})
		.skip(perPage * page)
    	.limit(perPage);

   	total = await Species
		.find(criteria)
		.count();

	console.log(total);

	return {
		species,
		total
	}

	 // db.collection.aggregate([

	 //      //{$sort: {...}}

	 //      //{$match:{...}}

	 //      {$facet:{

	 //        "stage1" : [ {"$group": {_id:null, count:{$sum:1}}} ],

	 //        "stage2" : [ { "$skip": 0}, {"$limit": 2} ]
	  
	 //      }},
	     
	 //     {$unwind: "$stage1"},
	  
	 //      //output projection
	 //     {$project:{
	 //        count: "$stage1.count",
	 //        data: "$stage2"
	 //     }}

	 // ]);
}
