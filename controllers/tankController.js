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

	const { tankId, userId } = req.query;

	if(tankId || userId){

		try {
			const tanks = await tankService.get(req, res, next);

			return res.status(200).json({
				tanks
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
		const tanks = await tankService.getAll(req, res, next);

		return res.status(200).json({
			tanks
		})

	} catch (err) {
		next(err)
	}
}

exports.search = async (req, res, next) => {
		
	try {
		const { tanks, total } = await tankService.search(req, res, next);

		return res.status(200).json({
			tanks,
			total
		})

	} catch (err) {
		next(err)
	}
}
