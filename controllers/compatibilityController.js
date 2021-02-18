// controllers/compatibilityController.js

const Compatibility 		= require('../models/compatibility');
const compatibilityService	= require('../services/compatibilityService');
const {	ErrorHandler }		= require('../helpers/errorHandler');

let compatibility;

exports.create = async (req, res, next) => {

	try{
		compatibility = await compatibilityService.create(req, res, next);

		return res.status(201).json({
			compatibility: compatibility,
			message: req.i18n.t('compatibility.create.success', {compatibility}),
		})

	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {

	try {
		
		compatibility = await compatibilityService.update(req, res, next);

		return res.status(200).json({
			compatibility,
			message: req.i18n.t('compatibility.update.success', {compatibility}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.get = async (req, res, next) => {

	const { compatibilityId, speciesAId, speciesBId, tankId } = req.query;

	if(compatibilityId || (speciesAId && speciesBId) || tankId){

		try {
			const compatibility = await compatibilityService.get(req, res, next);

			return res.status(200).json({
				compatibility
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
		const compatibility = await compatibilityService.getAll(req, res, next);

		return res.status(200).json({
			compatibility
		})

	} catch (err) {
		next(err)
	}
}

// exports.search = async (req, res, next) => {
		
// 	try {
// 		const { compatibility, total } = await compatibilityService.search(req, res, next);

// 		return res.status(200).json({
// 			compatibility,
// 			total
// 		})

// 	} catch (err) {
// 		next(err)
// 	}
// }
