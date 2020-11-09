// controllers/speciesController.js

const Species 			= require('../models/species');
const speciesService	= require('../services/speciesService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let species;

exports.create = async (req, res, next) => {

	console.log(req.body);

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
		const { species, total } = await speciesService.search(req, res, next);

		return res.status(200).json({
			species,
			total
		})

	} catch (err) {
		next(err)
	}
}
