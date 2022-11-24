// controllers/speciesController.js

const Species 			= require('../models/species');
const speciesService	= require('../services/speciesService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let species;

exports.create = async (req, res, next) => {

	try{
		species = await speciesService.create(req, res, next);

		return res.status(201).json({
			species: species,
			message: req.i18n.t('species.create.success', {species}),
		})

	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {

	try {
		
		species = await speciesService.update(req, res, next);

		return res.status(200).json({
			species,
			message: req.i18n.t('species.update.success', {species}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.get = async (req, res, next) => {

	const { speciesId } = req.query;

	if(speciesId){

		try {
			const species = await speciesService.get(req, res, next);

			return res.status(200).json({
				species
			})

		} catch (err) {
			next(err)
		}

	}else{
		exports.getAll(req, res, next);
	}


}


exports.getAll = async (req, res, next) => {
		
	try {
		const species = await speciesService.getAll(req, res, next);

		return res.status(200).json({
			species
		})

	} catch (err) {
		next(err)
	}
}

exports.search = async (req, res, next) => {
		
	try {
		const { species, total, page, field, direction } = await speciesService.search(req, res, next);

		return res.status(200).json({
			species,
			total,
      page,
      field,
      direction
		})

	} catch (err) {
		next(err)
	}
}

exports.uploadFile = async (req, res, next) => {
		
	try {
		data = await speciesService.uploadFile(req, res, next);

		return res.status(200).json({
      data: data,
			message: 'species.upload.success',
		})

	} catch (err) {
		next(err)
	}
}
