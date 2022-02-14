// services/speciesService.js

const fs			= require('fs');
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
const config		= require('../config/preferences'); 
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
	const locale = req.user.locale || defaultLocale;
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
	const perPage = config.pagination;
	let criteria = {};

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
		let regex = new RegExp(keyword, 'i');
		let nameField = 'name.'+locale;
		let otherNamesField= 'otherNames.'+locale;
		criteria.$or = [
			{ ['scientificName'] : { $regex: regex }},
			{ ['scientificNameSynonyms'] : { $regex: regex }},
			{ [nameField] : { $regex: regex }},
			{ [otherNamesField]: { $regex: regex } }
		];
	}

  if(tank){ // Use tank params
    // Look for the main species
    tank = await Tank
			.findById(tank);
    let { species }  = this.findMainSpecies(tank.species);
    
    // Overwrite params with main species' params
    const params = species.parameters;
    params.temperature.min ? minTemp = params.temperature.min : null;
    params.temperature.min ? maxTemp = params.temperature.max : null;
    params.ph.min ? minPh = params.ph.min : null;
    params.ph.min ? maxPh = params.ph.max : null;
		params.gh.min ? minGh = params.gh.min : null;
    params.gh.min ? maxGh = params.gh.max : null;
		params.kh.min ? minKh = params.kh.min : null;
    params.kh.min ? maxKh = params.kh.max : null;
  }

  if(minTemp){
    criteria['parameters.temperature.max'] = { $gte: minTemp };
  }
  if(maxTemp){
    criteria['parameters.temperature.min'] = { $lte: maxTemp };
  }

  if(minPh){
    criteria['parameters.ph.max'] = { $gte: minPh };
  }
  if(maxPh){
    criteria['parameters.ph.min'] = { $lte: maxPh };
  }

  if(minGh){
    criteria['parameters.gh.max'] = { $gte: minGh };
  }
  if(maxGh){
    criteria['parameters.gh.min'] = { $lte: maxGh };
  }

  if(minKh){
    criteria['parameters.kh.max'] = { $gte: minKh };
  }
  if(maxKh){
    criteria['parameters.kh.min'] = { $lte: maxKh };
  }

	if(type){
		criteria.type = type;
	}

	if(family){
		criteria.family = family;
	}

	if(group){
		criteria.group = group;
	}

	if(depth){
		criteria.depth = depth;
	}

	if(behavior){
		criteria.behavior = { $in: behavior } // Matchs any of the colors ($in is like OR and $all like AND)
	}

  if(color){
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
		criteria.cleaning = cleaning;
	}

	if(wild){
		criteria.wild = wild;
	}

	if(salt){
		criteria.salt = salt;
	}

	// console.log(criteria);

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
    'indivCoexistence',
    'coupleCoexistence',
    'onlyMascCoexistence',
    'onlyFemCoexistence',
    'haremCoexistence',
    'inverseHaremCoexistence',
	];

	function assignProp(array, prop){
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

	await Promise.all(speciesList.map(async function(species, index) {

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

		this[index] = {
			...this[index],
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
				}
			},
      coexistence: {
        indiv : !!species.indivCoexistence,
        couple : !!species.coupleCoexistence,
        onlyMasc : !!species.onlyMascCoexistence,
        onlyFem : !!species.onlyFemCoexistence,
        harem : !!species.haremCoexistence,
        inverseHarem : !!species.inverseHaremCoexistence,
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
		helpers.deleteProps(this[index], deleteProps);

	}, speciesList));

  // // Debug array of species to be insert in database (create file before executing)
  // var file = fs.createWriteStream('private/debug.txt');
  // file.on('error', function(err) { console.log('AUCH',err) });
  // speciesList.forEach(value => file.write(JSON.stringify(value)+'\n'));
  // file.end();

	return await Species.bulkWrite(speciesList.flatMap(species => ([
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
  const main = species.find(sp => sp.main);
  if(main)
    return main;
  else
    return null;
}