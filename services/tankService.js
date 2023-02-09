// services/tankService.js

const fs			  = require('fs');
const Tank			= require('../models/tank');
const Species		= require('../models/species');
const Type			= require('../models/type');
const Family		= require('../models/family');
const Group		  = require('../models/group');
const Feed			= require('../models/feed');
const Depth			= require('../models/depth');
const Behavior	= require('../models/behavior');
const Color		  = require('../models/color');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger }	= require('../helpers/logger');
const config		= require('../config/preferences'); 
const urlGenerator	= require('../helpers/urlGenerator');
const imagePath 		= urlGenerator.getImagesPath() + 'tank/';

exports.create = async (req, res, next) => {

	const { 
		name,
		userId,
		image,
		length,
		width,
		height,
		liters,
    species,
	} = req.body;

	tank = new Tank({
		name: name,
		user: userId,
		measures: {
      height: height,
      width: width,
      length: length
    },
    liters: liters,
    species: species,
	});

	if(image){
		saveImage(image)
	}

	return await tank.save();
}

exports.get = async (req, res, next) => {
	const { tankId, userId, compatibility } = req.query;

	if(tankId){
    tanks = await Tank.findById(tankId);
	}
	else if(userId){
		tanks = await Tank
			.find({user: userId});
	}

	if(compatibility){
		// Feature to add the comatibility to the tanks (avoid two calls from app to retrieve the tank and then the compat.)
		throw new ErrorHandler(501, 'notImplemented');
	}

	if(!tanks)
		throw new ErrorHandler(404, 'tank.notFound');

	return tanks;
}
 
exports.getAll = async (req, res, next) => {

	tanks = await Tank.find();

	return tanks;
}

exports.update = async (req, res, next) => {

	const { 
		tankId,
		name,
		image,
		species,
		length,
		width,
		height,
		liters,
	} = req.body;

	tank = await Tank.findById(tankId);

	if(!tank)
		throw new ErrorHandler(404, 'tank.notFound');

	if(name) tank.name = name;
	if(species) tank.species = species;
	if(length) tank.measures.length = length;
	if(width) tank.measures.width = width;
	if(height) tank.measures.height = height;
	if(liters) tank.liters = liters;

	if(image){
		saveImage(image);
	}

	await tank.save();
  return await Tank.findById(tankId);
}

exports.search = async (req, res, next) => {

	let keyword = req.query.keyword;
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

	if(!keyword){
		keyword = '';
	}

	const regex = new RegExp(keyword, 'i');	

	// Retrieve tanks
	tanks = await Tank
		.aggregate([
			    {$lookup: {
			        from: 'users', 
			        localField: 'user', 
			        foreignField: '_id', 
			        as: 'user'
			    }},
			    {$unwind: {path: '$user'}},
			    {$match: {
			    	$or: [
			    		{ 'name': { $regex: regex }},
			    		{ 'user.name': { $regex: regex }},
			    		{ 'user.email': { $regex: regex }}
			    	]
			    }},
		])
		.sort({[field]: direction})
		.skip(perPage * page)
    .limit(perPage);


    // Retrive search total number of tanks 
   	total = await Tank
		.aggregate([
			    // {$match: { 'name' : { $regex: regex } }},
			    {$lookup: {
			        from: 'users', 
			        localField: 'user', 
			        foreignField: '_id', 
			        as: 'user'
			    }},
			    {$unwind: {path: '$user'}},
			    {$match: {
			    	$or: [
			    		{ 'name': { $regex: regex }},
			    		{ 'user.name': { $regex: regex }},
			    		{ 'user.email': { $regex: regex }}
			    	]
			    }},
			    { $count: "total" }
		]);

	if(total[0]){
		total = total[0].total
	}
	else{
		total = 0;
	}

	return {
		tanks,
		total,
	}
}

exports.delete = async (req, res, next) => {
	const { tankId, userId } = req.query;
	let tanks;

	if(tankId){
		tanks = await Tank.findByIdAndDelete(tankId);
	}
	else if(userId){
		tanks = await Tank
			.deleteMany({user: userId});
	}

	if(!tanks)
		throw new ErrorHandler(404, 'tank.notFound');

	return tanks;
}

// species is an object { species, quantity, main }
exports.addSpecies = async (req, res, next) => {
	const { tankId, species } = req.body;

	tank = await Tank.findById(tankId);

	species.forEach(function(newSp){
		let found = false;

		tank.species.forEach(function(tankSp) {
			// console.log(tankSp.species._id.equals(newSp.species))
      if (tankSp.species._id.equals(newSp.species))
        found = true;
		});

		if(!found){
			tank.species.push(newSp)
		} else{
			throw new ErrorHandler(404, 'tank.species.alreadyExists');
		}
  });

  await tank.save();
  return await Tank.findById(tankId);

}
	
function saveImage(image) {
	let match = /\.(\w+)$/.exec(image.uri);
	let fileType = match ? `${match[1]}` : `jpeg`; // Figure out image extension and store
	fs.writeFile(`${imagePath}${tank._id}.${fileType}`, image.base64, 'base64', function(err) {
	  if(err)
	  	throw new ErrorHandler(500, 'image.notSaved');
	});
}
