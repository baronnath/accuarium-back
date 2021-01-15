// controllers/tankController.js

const tankService	= require('../services/tankService');
const {	ErrorHandler }	= require('../helpers/errorHandler');

let tank;

exports.create = async (req, res, next) => {

	try{
		tank = await tankService.create(req, res, next);

		return res.status(201).json({
			tank: tank,
			message: req.i18n.t('tank.create.success', {tank}),
		})

	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {

	try {
		
		tank = await tankService.update(req, res, next);

		return res.status(200).json({
			tank,
			message: req.i18n.t('tank.update.success', {tank}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.get = async (req, res, next) => {

	const { tankId } = req.query;

	if(tankId){

		try {
			const tank = await tankService.get(req, res, next);

			return res.status(200).json({
				tank
			})

		} catch (err) {
			next(err)
		}

	}else{
		console.log('this.getAll')
		exports.getAll(req, res, next);
	}


}


exports.getAll = async (req, res, next) => {
		
	try {
		const tank = await tankService.getAll(req, res, next);

		return res.status(200).json({
			tank
		})

	} catch (err) {
		next(err)
	}
}

exports.search = async (req, res, next) => {
		
	try {
		const { tank, total } = await tankService.search(req, res, next);

		return res.status(200).json({
			tank,
			total
		})

	} catch (err) {
		next(err)
	}
}
