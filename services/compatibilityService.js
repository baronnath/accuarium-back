// services/compatibilityService.js

const fs						= require('fs');
const Compatibility	= require('../models/compatibility');
const Species				= require('../models/species');
const Type					= require('../models/type');
const Family				= require('../models/family');
const Feed					= require('../models/feed');
const Depth					= require('../models/depth');
const Behavior			= require('../models/behavior');
const Tank					= require('../models/tank');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger }		= require('../helpers/logger');
const config				= require('../config/preferences'); 
const urlGenerator	= require('../helpers/urlGenerator');
const excel					= require('../helpers/excel');

const imagePath = urlGenerator.getImagesPath('compatibility');

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
getTankCompatibility = async (data) => {

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

		if(!tank)
			throw new ErrorHandler(404, 'tank.notFound');

		species = tank.species;
		mainSpecies = species.find(species => species._id.toString() == tank.mainSpecies.toString());

		tankCompatibility['species'] = await getTankSpeciesCompatibility(tankId);
	}

	// Parameters compatibility: compare parameters with main species
	species.forEach(function(species) {

		// Temperature
		temperatureCompatibility = isParameterCompatible(mainSpecies.parameters.temperature, species.parameters.temperature);

		// pH
		phCompatibility = isParameterCompatible(mainSpecies.parameters.ph, species.parameters.ph);

		// dH
		dhCompatibility = isParameterCompatible(mainSpecies.parameters.dh, species.parameters.dh);

		tankCompatibility['parameters'][species._id] = {
			temperature: temperatureCompatibility,
			ph: phCompatibility,
			dh: dhCompatibility
		}
	});

	return tankCompatibility
}


getTankSpeciesCompatibility = async (tankId) => {

	let query = [];
	tank = await Tank.findById(tankId);

	if(!tank)
		throw new ErrorHandler(404, 'tank.notFound');

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

// Formula: c = (b1-a1)*(b1-a2) where a1 is the smaller value  -> if c <= 0 means superposition
isParameterCompatible = (rangeA, rangeB) => {

	// Look for the smaller range of parameters
	if(rangeA.min <= rangeB){
		a = rangeA;
		b = rangeB;
	}else{
		a = rangeB;
		b = rangeA;
	}

	// Check values are set
	if(!a.min || !a.max || !b.min){
		return null;
	}

	intersection = (b.min - a.min)*(b.min - a.max);

	// Intersecion <= 0 means that values are share
	return intersection <= 0;

}

exports.uploadFile = async (req, res, next) => {

	const { path } = req.file;
	let { compatibility: compatibilityList } = excel.toJSON(path);
	let compatibilities = [];


	// Retrieve all species
	const species = await Species.find();

	compatibilityList.forEach(function(compatibility, index) {

		// Skip first empty values
		if(!compatibility.scientificName){
			return;
		}

		let speciesA = species.find(species => species.scientificName === compatibility.scientificName);

		if(!speciesA){
			throw new ErrorHandler(404, 'species.notFound', compatibility.scientificName);
		}

		Object.keys(compatibility).forEach(key => {

			// Skip first line or compatibility between same species
			if(key === compatibility.scientificName || key === 'scientificName'){
				return;
			}

			let speciesB = species.find(species => species.scientificName === key);

			if(!speciesB){
				throw new ErrorHandler(404, 'species.notFound', key);
			}

			this.push({
				speciesA: speciesA._id,
				speciesB: speciesB._id,
				compatibility: compatibility[key]
			});
		});

	}, compatibilities);

	return await Compatibility.insertMany(compatibilities);
	
}