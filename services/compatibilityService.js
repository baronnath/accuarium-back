// services/compatibilityService.js

const fs				= require('fs');
const Compatibility		= require('../models/compatibility');
const Species			= require('../models/species');
const Type				= require('../models/type');
const Family			= require('../models/family');
const Feed				= require('../models/feed');
const Depth				= require('../models/depth');
const Behavior			= require('../models/behavior');
const Tank				= require('../models/tank');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger }		= require('../helpers/logger');
const config			= require('../config/preferences'); 
const urlGenerator		= require('../helpers/urlGenerator');
const excel				= require('../helpers/excel');
const helpers				= require('../helpers/helpers');

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
		compatibility = await getInterpeciesCompatibility([speciesAId,speciesBId]);
	}

	if(!compatibility) {
		throw new ErrorHandler(404, 'compatibility.notFound');
	}

	return compatibility;

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

	let species = [];
	let mainSpecies = null;
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

		// extract species from tank data
		tank.species.forEach(function(sp) {
			speciesObj = sp.species.toObject();
			speciesObj.numSpecimen = sp.quantity;
			species.push(speciesObj);
			if(sp.main)
				mainSpecies = speciesObj;
		});

	}

	if(!tank.species.length){
		throw new ErrorHandler(404, 'tank.speciesNotFound');
	}
	
	if(!mainSpecies){
		throw new ErrorHandler(404, 'tank.mainSpeciesNotFound');
	}

	if(tank.species.length === 1){ // if tank has only one species (the main species), the compatibility can be calculated
		return {};
	}

  // Intraspecies compatibility: analize the species compatibility table
	tankCompatibility['species'] = await getInterpeciesCompatibility(species);

	// Parameters compatibility: compare parameters with main species
	species.forEach(function(species) {
		// if(species._id != mainSpecies._id) {

			// Temperature
			temperatureCompatibility = isParameterCompatible(mainSpecies.parameters.temperature, species.parameters.temperature);

			// pH
			phCompatibility = isParameterCompatible(mainSpecies.parameters.ph, species.parameters.ph);

			// gH
			ghCompatibility = isParameterCompatible(mainSpecies.parameters.gh, species.parameters.gh);

			// kH
			khCompatibility = isParameterCompatible(mainSpecies.parameters.kh, species.parameters.kh);

			tankCompatibility['parameters'][species._id] = {
				temperature: temperatureCompatibility,
				ph: phCompatibility,
				gh: ghCompatibility,
				kh: khCompatibility,
			}

			if(tank){ // The coexistence is related to the number of specimen in tank
				if(!tankCompatibility['coexistence']) tankCompatibility['coexistence'] = {}
				tankCompatibility['coexistence'][species._id] = isCoexistenceCompatible(species);
				// console.log(tank);
			}
		// }
	});

	return tankCompatibility
}


getInterpeciesCompatibility = async (species) => {

	let query = [];

	// Extract id if species object is provided
	speciesIds = extractSpeciesIds(species);

	speciesIds.forEach(function(speciesA) {
		species.forEach(function(speciesB) {
			if(String(speciesA) != String(speciesB)){
				query.push(
					{ $and: [
			          	{speciesA: speciesA},
			          	{speciesB: speciesB}
			        ]}
			    );
			}
		});
	});
	// console.log(`${JSON.stringify(query)}`);
	compatibility = await Compatibility
		.find({ $or: query });

	return splitCompatibilitiesBySpecies(species,compatibility);
}

extractSpeciesIds = (species) => {
	let speciesIds = [];
	species.forEach(function(sp, i) {
		if(helpers.isObject(sp)) this[i] = sp._id;
  }, speciesIds);
  return speciesIds;
}

splitCompatibilitiesBySpecies = (species, compatibilities) => {

	// Extract id if species object is provided
	speciesIds = extractSpeciesIds(species);
	
	// Declare objects
	splittedCompatibilities = {};
	speciesIds.forEach(function(speciesId) {
		splittedCompatibilities[speciesId] = {} 
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
// Return true if two param. ranges share any values. Return null if range is undefined or both values are zero.
isParameterCompatible = (rangeA, rangeB) => {

  // Set undefined values to zero
  rangeA = removedUndefinedValues(rangeA);
  rangeB = removedUndefinedValues(rangeB);

  function removedUndefinedValues (range) { 
    if(range.min == undefined) range.min = 0;
    if(range.max == undefined) range.max = 0;

    // Return null if both are undefined or zero
    if(!range.min && !range.max) return null;
    return range;
  }

  if(!rangeA || !rangeB)
    return null;

	// Look for the smaller range of parameters
	if(rangeA.min <= rangeB.min){
		a = rangeA;
		b = rangeB;
	}else{
		a = rangeB;
		b = rangeA;
	}

	// // Check values are set
	// if(a.min == undefined || a.max  == undefined || b.min == undefined){
	// 	return null;
	// }

	intersection = (b.min - a.min)*(b.min - a.max);

	// Intersecion <= 0 means that values are shared
	return intersection <= 0;

}

function isCoexistenceCompatible (species) {
	let isCompatible = false;
	const coexistence = species.coexistence;
	const numSpecimen = species.numSpecimen;

	if(coexistence.indiv && numSpecimen == 1) isCompatible = true;
	if(coexistence.couple && numSpecimen == 2) isCompatible = true;
	if(numSpecimen >= 1)
		if(coexistence.onlyMasc || coexistence.onlyFem) isCompatible = true;
	if(numSpecimen >= 1)
  	if(coexistence.mixedGroup || coexistence.harem || coexistence.inverseHarem) isCompatible = true;

	return isCompatible;
}

exports.uploadFile = async (req, res, next) => {

	const { path } = req.file;
	const { compatibility: compatibilityList } = excel.toJSON(path);
	let compatibilities = [];
	let speciesIncluded = []; // Skip duplicated information about same pair of species

	const species = await Species.find();

	compatibilityList.forEach(function(speciesCompatibility, index) {

		// Iterate over item properties (as it was an array)
		Object.keys(speciesCompatibility).forEach(function(prop) {
			let speciesB = null;

			if(prop == 'scientificName'){
				speciesA = species.find(sp => sp.scientificName === speciesCompatibility[prop]);
				if(!speciesA){
					throw new ErrorHandler(404, 'species.notFound', speciesCompatibility[prop]);
				}
				speciesIncluded.push(speciesA.scientificName);
				return;
			}
			
			if(speciesCompatibility[prop] == 'x') return; // 'x' represents same species compatibility cell
			
			speciesB = species.find(sp => sp.scientificName === prop);
			if(!speciesB){
				throw new ErrorHandler(404, 'species.notFound', prop);
			}

			if(speciesIncluded.find(incl => incl == speciesB.scientificName)){ // Skip if compatibility  pair was registered previously
				compatibilities.push({
					speciesA: speciesA._id,
					speciesB: speciesB._id,
					compatibility: speciesCompatibility[prop],
				});
			}
		});
	});

	return await Compatibility.bulkWrite(compatibilities.map(compatibility => ({
		updateOne: {
			filter: {
				$or: [
					{ $and: [
						{speciesA: compatibility.speciesA},
						{speciesB: compatibility.speciesB}
					]},
					{ $and: [
						{speciesA: compatibility.speciesB},
						{speciesB: compatibility.speciesA}
					]},
				]
			},
			update: compatibility,
			upsert: true,
		}
	})));
	
}

exports.functionsToTest = {
  getTankCompatibility,
  getInterpeciesCompatibility,
  splitCompatibilitiesBySpecies,
  isParameterCompatible,
}