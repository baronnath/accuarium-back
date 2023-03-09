// controllers/leadController.js

const leadService		= require('../services/leadService');

let lead;

exports.create = async (req, res, next) => {

	try{

		lead = await leadService.create(req, res, next);

		return res.status(201).json({
			lead: lead,
			message: req.i18n.t('lead.create.success'),
		})

	} catch (err) {
		next(err)
	}
}


exports.get = async (req, res, next) => {
		
	try {
		lead = await leadService.get(req, res, next);

		return res.status(200).json({
			lead
		})

	} catch (err) {
		next(err)
	}
}

exports.getAll = async (req, res, next) => {
		
	try {
		const leads = await leadService.getAll(req, res, next);

		return res.status(200).json({
			leads
		})

	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {

	try {
		
		lead = await leadService.update(req, res, next);

		return res.status(200).json({
			lead,
			message: req.i18n.t('lead.update.success', {lead}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.delete = async (req, res, next) => {

	try {
		
		lead = await leadService.delete(req);

		return res.status(201).json({
			message: req.i18n.t('lead.delete.success',{lead}),
		})
		
	} catch (err) {
		next(err)
	}
}
