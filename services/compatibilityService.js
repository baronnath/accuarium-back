// services/compatibilityService.js

const fs 			= require('fs');
const Compatibility = require('../models/compatibility');
const Type 			= require('../models/type');
const Family 		= require('../models/family');
const Feed 			= require('../models/feed');
const Depth 		= require('../models/depth');
const Behavior 		= require('../models/behavior');
const Tank 			= require('../models/tank');
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
		tankId,
		speciesAId,
		speciesBId
	} = req.query;

	if(compatibilityId){

		compatibility = await Compatibility
			.findById(compatibilityId);

	}else if(tankId){

		compatibility = await getTankCompatibility(tankId);

	}
	else{

		compatibility = await getSpeciesCompatibility(speciesAId,speciesBId);
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


getSpeciesCompatibility = async (tankId) => {	

	compatibility = await Compatibility
		.find({
		      $or: [
		          { $and: [
		          	{speciesA: speciesAId},
		          	{speciesB: speciesBId}
		          ]},
		          { $and: [
		          	{speciesA: speciesBId},
		          	{speciesB: speciesAId}
		          ]},
		      ]
	  	});

	return compatibility;
}


getTankCompatibility = async (tankId) => {

	let query = [];
	tank = await Tank.findById(tankId);

	if(tank){

		tank.species.forEach(function(speciesA) {
			tank.species.forEach(function(speciesB) {
				if(speciesA._id != speciesB._id){
					query.push(
						{ $and: [
				          	{speciesA: speciesA._id},
				          	{speciesB: speciesB._id}
				        ]}
				    );
				}
			});
		});
		// console.log(`${JSON.stringify(query)}`);
		compatibility = await Compatibility
			.find({ $or: query });

		return splitCompatibilitiesBySpecies(tank.species,compatibility);

	}else{
		throw new ErrorHandler(404, 'tank.notFound');
	}
}



// CHECK COMPATIBILTY
/**
 * @api areCompatible
 * @apiPrivate
 * @apiDescription Check species compatibility.
 * @apiGroup Compatibility
 * @apiPermission none
 * @apiVersion 0.1.0
 *
 * @apiParam {String,Array} tankId or speciesId array                     Species can be provided or the species from the specified tank.
 *
 */
areCompatible = async (data) => {

	let tankCompatibility = {
		species: {},
		parameters: {}
	};
	
	if(data.isArray){ // speciesId array
		throw new ErrorHandler(501, 'notImplemented');
		speciesId = data.speciesId;
		mainSpeciesId = data.mainSpeciesId;

		// Get species data
		// ...
	}
	else{ // tankId provided

		const tankId = data;
		tank = await Tank.findById(tankId);

		species = tank.species;
		mainSpeciesId = tank.mainSpecies;

		compatibilities = await getTankCompatibility(tankId);
	}

	// Species compatibilities

	tankCompatibility['species'] = splitCompatibilitiesBySpecies(species, compatibilities);

	// Parameters compatibility: compare parameters with main species
	species.forEach(function(species) {

		// Temperature
		temperatureCompatibility = 1;

		// pH
		phCompatibility = 1;

		// dH
		dhCompatibility = 1;

		tankCompatibility['parameters'][species._id] = {
			temperature: temperatureCompatibility,
			ph: phCompatibility,
			dh: dhCompatibility
		}
	});

	console.log(tankCompatibility);

}

splitCompatibilitiesBySpecies = (species, compatibilities) => {
	
	// Declare objects
	splittedCompatibilities = {};
	species.forEach(function(species) {
		splittedCompatibilities[species._id] = {} 
	});

	compatibilities.forEach(function(compatibility) {
		compatibilityData = {
			compatibility: compatibility.compatibility,
			warnings: compatibility.warnings
		}

		splittedCompatibilities[compatibility.speciesA][compatibility.speciesB] = compatibilityData;
		splittedCompatibilities[compatibility.speciesB][compatibility.speciesA] = compatibilityData;
	});

	return splittedCompatibilities;
}
