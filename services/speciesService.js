// services/speciesService.js

const fs			= require('fs');
const mongoose  = require('mongoose');
const ObjectId 	= mongoose.Types.ObjectId;
const Species		= require('../models/species');
const Tank		= require('../models/tank');
const Type			= require('../models/type');
const Family		= require('../models/family');
const Group			= require('../models/group');
const Feed			= require('../models/feed');
const Color			= require('../models/color');
const Depth			= require('../models/depth');
const Behavior		= require('../models/behavior');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger }	= require('../helpers/logger');
const env						= process.env.NODE_ENV || 'development';
const serverConfig		= require('../config/server')[env]; 
const preferencesConfig		= require('../config/preferences'); 
const urlGenerator	= require('../helpers/urlGenerator');
const helpers		= require('../helpers/helpers');
const unitConverter	= require('../helpers/unitConverter');
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
		minGh,
		maxGh,
		minKh,
		maxKh,
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
			gh: {
				min: minGh,
				max: maxGh
			},
			kh: {
				min: minKh,
				max: maxKh
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
	const { speciesId, scientificName } = req.query;

	if(speciesId){
		species = await Species
			.findById(speciesId);
	}

	if(scientificName) {
		species = await Species
			.findOne({scientificName: scientificName});
	}

	if(!species)
		throw new ErrorHandler(404, 'species.notFound');

	return species
}
 
exports.getAll = async (req, res, next) => {

	species = await Species.find();

	return species;
}

exports.sitemapReport =  async (req, res, next) => {

	species = await Species.find();

	// Select scientificName field ("select" from mongoose is not working to filter fields) and format
	return species.map((sp, i) => sp.scientificName.replace(' ', '-').toLowerCase());
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
		length,
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
	if(length){
		species.length = length;
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

	async function objectIdArray(array){
		return array.map(val => ObjectId(val));
	}

	const locale = req.user && req.user.locale || req.query.locale || defaultLocale;
	let {
		keyword,
		field,
		direction,
		page,
    tank,
		minTemp,
		maxTemp,
		minPh,
		maxPh,
		maxGh,
		minGh,
		minKh,
		maxKh,
		type,
		family,
		group,
		depth,
		color,
		minLength,
		maxLength,
		minMinTank,
		maxMinTank,
		cleaning,
		wild,
		salt,
    behavior
	} = req.query;
	const perPage = preferencesConfig.pagination;
	let query;
	let criteria = {};
	let mainSpecies = null;
	let total;

	if(!field){
		field = 'scientificName'; // by name return same species in several pages (because name is nullable)
	}
	if(!direction){
		direction = 'ascending';
	}

	if(!page){
		page = 0;
	}

	if(keyword){
		criteria = { $text: { $search: keyword, $caseSensitive: false, $diacriticSensitive: false }};
	}


  if(tank){ // Use tank params
    // Look for the main species
		tank = await Tank.findById(tank);
		if(!tank){
    	throw new ErrorHandler(404, 'tank.notFound');
		}

		// Add tank volume as max tank volume if not specified
    !maxMinTank ? maxMinTank = tank.liters : null;
    console.log(tank.liters);

    let species = this.findMainSpecies(tank.species);
    if(!species){
    	throw new ErrorHandler(404, 'tank.mainSpeciesNotFound');
    }
    mainSpecies = species.species;
    if(!mainSpecies)
    	throw new ErrorHandler(404, 'tank.mainSpeciesNotFound');
    
    // Overwrite params with the tank main species' params
    const params = mainSpecies.parameters;
    params.temperature.min ? minTemp = params.temperature.min : null;
    params.temperature.min ? maxTemp = params.temperature.max : null;
    params.ph.min ? minPh = params.ph.min : null;
    params.ph.min ? maxPh = params.ph.max : null;
		params.gh.min ? minGh = params.gh.min : null;
    params.gh.min ? maxGh = params.gh.max : null;
		params.kh.min ? minKh = params.kh.min : null;
    params.kh.min ? maxKh = params.kh.max : null;
  }

  // Water chemistry params
  // The param is not considered if null 
  let paramsCriteria = [];

  if(minTemp){
    paramsCriteria.push({'$or': [{ $expr: { $gte: ["$parameters.temperature.max", minTemp] }}, { "parameters.temperature.max": null }] });
  }
  if(maxTemp){
    paramsCriteria.push({'$or': [{ $expr: { $lte: ["$parameters.temperature.min", maxTemp] }}, { "parameters.temperature.min": null }] });
  }

  if(minPh){
    paramsCriteria.push({'$or': [{ $expr: { $gte: ["$parameters.ph.max", minPh] }}, { "parameters.ph.min": null }] });
  }
  if(maxPh){
    paramsCriteria.push({'$or': [{ $expr: { $lte: ["$parameters.ph.min", maxPh] }}, { "parameters.ph.max": null }] });
  }

  if(minGh){
    paramsCriteria.push({'$or': [{ $expr: { $gte: ["$parameters.gh.max", minGh] }}, { "parameters.gh.max": null }] });
  }
  if(maxGh){
    paramsCriteria.push({'$or': [{ $expr: { $lte: ["$parameters.gh.min", maxGh] }}, { "parameters.gh.min": null }] });
  }

  if(minKh){
    paramsCriteria.push({'$or': [{ $expr: { $gte: ["$parameters.kh.max", minKh] }}, { "parameters.kh.max": null }] });
  }
  if(maxKh){
    paramsCriteria.push({'$or': [{ $expr: { $lte: ["$parameters.kh.min", maxKh] }}, { "parameters.kh.min": null }] });
  }

  if (paramsCriteria.length) {
  	criteria['$and'] = paramsCriteria;
  }
  // Fin water chemistry params

	if(type){
		criteria.type = ObjectId(type);
	}

	if(family){
		criteria.family = ObjectId(family);
	}

	if(group){
		criteria.group = ObjectId(group);
	}

	if(depth){
		criteria.depth = ObjectId(depth);
	}


	if(behavior){
		behavior = await objectIdArray(behavior)
		criteria.behavior = { $in: [ behavior ] } // Matchs any of the colors ($in is like OR and $all like AND)
	}

  if(color){
  	color = await objectIdArray(color)
		criteria.color = { $in: color } // Matchs any of the colors ($in is like OR and $all like AND)
	}

	if(minLength){
		criteria['length.max'] = { $gte: minLength };
	}
	if(maxLength){
		criteria['length.min'] = { $lte: maxLength };
	}

	if(minMinTank || maxMinTank){
		criteria['minTankVolume'] = {};
		if(minMinTank){
			criteria['minTankVolume'].$gte = minMinTank;
		}
		if(maxMinTank){
			criteria['minTankVolume'].$lte = maxMinTank;
		}
	}

	if(cleaning){
		criteria.cleaning = String(cleaning) == "true"; // Value must be boolean, instead of the retrieved from query
	}

	if(wild){
		criteria.wild = String(wild) == "true"; // Value must be boolean, instead of the retrieved from query
	}

	if(salt){
		criteria.salt = salt;
	}

	query = [
		{
			$match: criteria
		}
	];

	if(tank && tank.species) {

		let speciesIds = [];
		let compat = [];

		tank.species.map(sp => {
			s = sp.species;
			speciesIds.push(ObjectId(s._id));

			compat = [
				...compat,
				{
					$and: [
	 					{ $expr: { $eq: ["$speciesA", "$$species"] }},
	 					{ $expr: { $eq: ["$speciesB", ObjectId(s._id)] }},
	 				]
				},
				{
 					$and: [
	 					{ $expr: { $eq: ["$speciesB", "$$species"] }},
	 					{ $expr: { $eq: ["$speciesA", ObjectId(s._id)] }},
	 				]
				}
			];	
		});

		query = [
			...query,
			{
		    $lookup: {
		      from: "compatibilities",
		       let: { species: "$_id" },
		       pipeline: [
		       	{
		       		$match: {
		       			$or: compat,
		       			compatibility: { $ne: 0 },
		       		}
		       	}
		       ],
		       as: "compatibility"
		    }
		  },
		  {
		    $match: {
		      compatibility: { $size: speciesIds.length }
		    }
		  },
		  {
		    $project: {
		      _id: 1,
		      scientificName: 1,
		      name: 1,
		      otherNames: 1,
		      compatibility: 1
		    }
		  }
		];
	}

	// console.log(JSON.stringify(query, null, 4));

	sp = await Species.aggregate(query)
	.sort({[field]: direction})
	.skip(perPage * page)
  .limit(perPage)
  .exec();

	species = sp.map(s => this.addSpeciesImages(s));

	return {
		species,
    page,
    field,
    direction
	}
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
		'minTemp',
		'maxTemp',
		'minPh',
		'maxPh',
		'GhUnits',
		'minGh',
		'maxGh',
		'KhUnits',
		'minKh',
		'maxKh',
    'minTds',
		'maxTds',
    'indivCoexistence',
    'coupleCoexistence',
    'onlyMascCoexistence',
    'onlyFemCoexistence',
    'haremCoexistence',
    'inverseHaremCoexistence',
    'mixedGroupCoexistence',
    'beta',	
	];

	function isBeta(species) {
		let beta = species.beta || 0; // prevent empty values
		if(serverConfig.beta && !beta){
			return false;
		}
		return true;
	}

	function assignProp(array, prop) {
		let found = undefined;
		if(prop != undefined){
			let needle = prop.trim();
			found = array.find(obj => obj.name[defaultLocale] === needle);
			if(found == undefined)
				logger.warn(`Property not found: ${prop}`);
		}
		return found;
	}

	// Retrieve all from type, family, groups, feed, behaviors and colors
	const types 	= await Type.find();
	const families 	= await Family.find();
	const groups 	= await Group.find();
	const feeds		= await Feed.find();
	const behaviors = await Behavior.find();
	const colors 	= await Color.find();
	const depths 	= await Depth.find();

	speciesArray = await Promise.all(speciesList.filter(isBeta).map(async function(species, index, speciesArray) {

		let type = assignProp(types, species.type);
		let family = assignProp(families, species.family);
		let group = assignProp(groups, species.group);
		let feed = assignProp(feeds, species.feed);
		let depth = assignProp(depths, species.depth);

		let behaviorList = [];
		if(species.behavior) {
			beh = species.behavior.split(',');

			beh.forEach(function(b, index) {
				this[index] = assignProp(behaviors, b);
			}, behaviorList);
		}
		
		let colorList = [];
		if(species.color) {
			col = species.color.split(',');
			col.forEach(function(c, index) {
				this[index] = assignProp(colors, c);
			}, colorList);
		}

		if(species.GhUnits) {
			// Convert hardness to base unit (ppm)
			if(species.minGh)
				species.minGh = await unitConverter(species.minGh, 'hardness', species.GhUnits);
			if(species.maxGh)
				species.maxGh = await unitConverter(species.maxGh, 'hardness', species.GhUnits);
		}
		if(species.KhUnits) {
			// Convert hardness to base unit (ppm)
			if(species.minKh)
				species.minKh = await unitConverter(species.minKh, 'hardness', species.KhUnits);
			if(species.maxKh)
				species.maxKh = await unitConverter(species.maxKh, 'hardness', species.KhUnits);
		}

    if(species.TdsUnits) {
			// Convert hardness to base unit (ppm)
			if(species.minTds)
				species.minTds = await unitConverter(species.minTds, 'hardness', species.TdsUnits);
			if(species.maxTds)
				species.maxTds = await unitConverter(species.maxTds, 'hardness', species.TdsUnits);
		}

		species = {
			...species,
			scientificNameSynonyms: species.scientificNameSynonyms ? species.scientificNameSynonyms.split(',') : [],
			name: {
				en: species.nameEn || '',
				es: species.nameEs || '',
			},
			otherNames: {
				en: species.otherNamesEn ? species.otherNamesEn.split(',') : [],
				es: species.otherNamesEs ? species.otherNamesEs.split(',') : [],
			},
			// params: params, // This typo is not a mistake. Params cannot be inserted at the same time beacuse of the schema structure (subdocuments)
			params: {
				temperature: {
					min: species.minTemp || null,
					max: species.maxTemp || null
				},
				ph: {
					min: species.minPh || null,
					max: species.maxPh || null
				},
				gh: {
					min: species.minGh || null,
					max: species.maxGh || null
				},
				kh: {
					min: species.minKh || null,
					max: species.maxKh || null
				},
        tds: {
					min: species.minTds || null,
					max: species.maxTds || null
				}
			},
      coexistence: {
        indiv : !!species.indivCoexistence,
        couple : !!species.coupleCoexistence,
        onlyMasc : !!species.onlyMascCoexistence,
        onlyFem : !!species.onlyFemCoexistence,
        harem : !!species.haremCoexistence,
        inverseHarem : !!species.inverseHaremCoexistence,
        mixedGroup : !!species.mixedGroupCoexistence,
      },
			length: {
				min: species.minLength || 0,
				max: species.maxLength || 0
			},
			type: type ? type._id : null,
			family: family ? family._id : null,
			group: group ? group._id : null,
			feed: feed ? feed._id : null,
			depth: depth ? depth._id : null,
			color: colorList,
			behavior: behaviorList,
		};

		// Delete props in the excel list that don't match the species model (species list is not duplicated for memory optimization)
		helpers.deleteProps(species, deleteProps);

		return species;

	}));

  // // Debug array of species to be insert in database (create file before executing)
  // helpers.debug(speciesArray, true);

	return await Species.bulkWrite(speciesArray.flatMap(species => ([
		{
			updateOne: {
				filter: {scientificName: species.scientificName},
				update: species,
				upsert: true,
			}
		},
		{
			updateOne: {
				filter: {scientificName: species.scientificName},
				update: { $set: {parameters: species.params} },
			}
		}
	])))
	
}

exports.findMainSpecies = (species) => {
	if(!species.length)
		throw new ErrorHandler(404, 'tank.noSpecies');

  const main = species.find(sp => sp.main == true);

  if(main)
    return main;
  else
    return null;
}

exports.addSpeciesImages = (species) => {
	const path = urlGenerator.getImagesPath('species') + '/' + species.scientificName.replace(' ', '-').toLowerCase();
  const exists = fs.existsSync(path);
  if(exists){
    images = fs.readdirSync(path);
    species.images = images;
  }

  return species;
}