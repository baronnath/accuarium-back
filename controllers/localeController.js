// controllers/localeController.js

const Locale 				= require('../models/locale');
const localeService		= require('../services/localeService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let user;

exports.getAll = async (req, res, next) => {
		
	try {
        console.log('localeController')
		const locales = await localeService.getAll(req, res, next);

		return res.status(200).json({
			locales
		})

	} catch (err) {
		next(err)
	}
}
