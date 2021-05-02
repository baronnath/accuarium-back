// services/speciesService.js

const fs			= require('fs');
const Species		= require('../models/species');
const Type			= require('../models/type');
const Family		= require('../models/family');
const Group			= require('../models/group');
const Feed			= require('../models/feed');
const Color			= require('../models/color');
const Depth			= require('../models/depth');
const Behavior		= require('../models/behavior');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger }	= require('../helpers/logger');
const config		= require('../config/preferences'); 
const urlGenerator	= require('../helpers/urlGenerator');
const stringHelper	= require('../helpers/string');
const defaultLocale	= require('../config/translator')['fallbackLng']['default'][0]
const excel			= require('../helpers/excel');

const imagePath = urlGenerator.getImagesPath('species');

exports.create = async (req, res, next) => {

	const { 
		name,
		otherNames,
		image,
		typeId,
		familyId,
		groupId,
		minTemperature,
		maxTemperature,
		minPh,
		maxPh,
		minDh,
		maxDh,
		literSpecimen,
		minLength,
		maxLength,
		feedId,
		varietyOfId,
		depthId,
		behaviorId
	} = req.body;

	species = new Species({
		name: {
			[defaultLocale]: name
		},
		otherNames: {
			[defaultLocale]: otherNames
		},
		type: typeId,
		family: familyId,
		group: groupId,
		parameters: {
			temperature: {
				min: minTemperature,
				max: maxTemperature
			},
			ph: {
				min: minPh,
				max: maxPh
			},
			dh: {
				min: minDh,
				max: maxDh
			}
		},
		literSpecimen: literSpecimen,
		length: {
			min: minLength,
			max: maxLength
		},
		feed: feedId,
		varietyOf: varietyOfId,
		depth: depthId,
		behavior: behaviorId
	});

	// Figure out image extension and store
	let match = /\.(\w+)$/.exec(image.uri);
	let fileType = match ? `${match[1]}` : `jpg`;
	fs.writeFile(`${imagePath}${species._id}.${fileType}`, image.base64, 'base64', function(err) {
	  if(err)
	  	throw new ErrorHandler(500, 'image.notSaved');
	});

	setTimeout(function(){
		logger.silly(familyId);
		logger.silly(groupId);
	}, 3000);

	return await species.save();
}

exports.get = async (req, res, next) => {
	const { speciesId } = req.query;

	if(speciesId){
		species = await Species
			.findById(speciesId);
	}else{
		throw new ErrorHandler(404, 'species.notFound');
	}

	return species

}
 
exports.getAll = async (req, res, next) => {

	species = await Species.find().limit(50);

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
	const locale = req.user.locale || defaultLocale;
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

	if(keyword){
		let regex = new RegExp(keyword, 'i');
		let nameField = 'name.'+locale;
		let otherNamesField= 'otherNames.'+locale;
		criteria = {
			$or: [ { [nameField] : { $regex: regex }}, { [otherNamesField]: { $regex: regex } } ]
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

exports.uploadFile = async (req, res, next) => {

	const { path } = req.file;
	let { species: speciesList } = excel.toJSON(path);
	const deleteProps = [
		'nameEn',
		'nameEs',
		'otherNamesEn',
		'otherNamesEs',
		'minLength',
		'maxLength',
		'minPh',
		'maxPh',
		'minDh',
		'maxDh',
		'behavior', // TO BE FIXED
	];

	// Retrieve all from type, family, groups, feed and colors
	const types = await Type.find();
	const families = await Family.find();
	const groups = await Group.find();
	const feeds = await Feed.find();
	const colors = await Color.find();
	const depths = await Depth.find();

	// Transform otherNames in array


	speciesList.forEach(function(species, index) {

		type = types.find(type => type.name[defaultLocale] === species.type);
		family = families.find(family => family.name[defaultLocale] === species.family);
		group = groups.find(group => group.name[defaultLocale] === species.group);
		feed = feeds.find(feed => feed.name[defaultLocale] === species.feed);
		depth = depths.find(depth => depth.name[defaultLocale] === species.depth);
		
		let colorList = [];
		if(species.color){
			col = species.color.split(',');
			col.forEach(function(c, index) {
				this[index] = colors.find(color => color.name[defaultLocale] === c);
			}, colorList);
		}

		this[index] = {
			...this[index],
			name: {
				en: species.nameEn,
				es: species.nameEs,
			},
			otherNames: {
				en: species.otherNamesEn ? species.otherNamesEn.split(',') : [],
				es: species.otherNamesEs ? species.otherNamesEs.split(',') : [],
			},
			parameters: {
				temperature: {
					min: species.minTemp,
					max: species.maxTemp
				},
				ph: {
					min: species.minPh,
					max: species.maxPh
				},
				dh: {
					min: species.minDh,
					max: species.maxDh
				}
			},
			length: {
				min: species.minLength,
				max: species.maxLength
			},
			type: type ? type._id : null,
			family: family ? family._id : null,
			group: group ? group._id : null,
			feed: feed ? feed._id : null,
			depth: depth ? depth._id : null,
			color: colorList,
		};
		
		stringHelper.deleteProps(this[index], deleteProps);

	}, speciesList);

	console.log(speciesList);

	return await Species.insertMany(speciesList);
	
}
