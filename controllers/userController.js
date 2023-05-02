// controllers/userController.js

const User 				= require('../models/user');
const userService		= require('../services/userService');
const {	ErrorHandler }	= require('../helpers/errorHandler');
const defaultLocale		= require('../config/translator')['fallbackLng']['default'][0]

let user;

exports.isLoggedIn = async (req, res, next) => {

	try {
		req.user = await userService.isLoggedIn(req, res, next);
		await this.setLang(req, res, next);
 	} catch (err) {
		next(err)
	}
	next()
}

exports.isAllowedTo = (action, endpoint) => {
	return async (req, res, next) => {

		const access = ac.can(req.user.role.name[defaultLocale])[action](endpoint);
        if(access.granted)
        	next()
        else
        	next(new ErrorHandler(403, 'user.permission.denied'));
	}
}

exports.create = async (req, res, next) => {

	try{

		user = await userService.create(req, res, next);

		this.sendInvitation(user, req, res, next);

		return res.status(201).json({
			user: user,
			confirmationToken: user.confirmationToken,
			message: req.i18n.t('user.create.success', {user}),
		})

	} catch (err) {
		next(err)
	}
}


exports.get = async (req, res, next) => {
		
	try {
		user = await userService.get(req, res, next);
		await this.setLang(req, res, next);

		return res.status(200).json({
			user
		})

	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {

	try {
		
		user = await userService.update(req, res, next);

		return res.status(200).json({
			user,
			message: req.i18n.t('user.update.success', {user}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.delete = async (req, res, next) => {

	try {
		
		user = await userService.delete(req);

		return res.status(201).json({
			message: req.i18n.t('user.delete.success',{user}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.login = async (req, res, next) => {

	try {
		user = await userService.login(req, res, next);

		res.status(200).json({
			user: user,
			message: req.i18n.t('user.login.success',{user}),
			accessToken: user.accessToken
		})

	} catch (err) {
		next(err)
	}

}

exports.logout = async (req, res, next) => {

	try {
		
		await userService.logout(req);

		let user = req.user

		res.status(200).json({
			message: req.i18n.t('user.logout.success', {user}),
		})
		
	} catch (err) {
		next(err)
	}
}

exports.verify = async (req, res, next) => {

	try {
		
		user = await userService.verify(req, res, next);

		res.status(201).json({
			user,
			message: req.i18n.t('user.verify.success', {user}) 
		})
		
	} catch (err) {
		next(err)
	}
}

exports.resend = async (req, res, next) => {

	try {
		
		user = await userService.resend(req, res, next);

		this.sendInvitation(user, req, res, next);

		res.status(201).json({
			user,
			message: req.i18n.t('user.resend.success', {user}) 
		})
		
	} catch (err) {
		next(err)
	}
}

exports.sendInvitation = async (user, req, res, next) => {

	try{
		userService.sendInvitation(user, req, res, next);
	} catch (err) {
		next(err)
	}
}

exports.sendResetPasswordEmail = async (req, res, next) => {

	try{
		await userService.sendResetPasswordEmail(req, res, next);

		res.status(201).json({
			message: req.i18n.t('user.sendResetPasswordEmail.success')
		});

	} catch (err) {
		next(err)
	}
}

exports.resetPassword = async (req, res, next) => {

	try{
		user = await userService.resetPassword(req, res, next);

		res.status(201).json({
			user,
			message: req.i18n.t('user.resetPassword.success')
		});

	} catch (err) {
		next(err)
	}
}

exports.search = async (req, res, next) => {
		
	try {
		const { users, total } = await userService.search(req, res, next);

		return res.status(200).json({
			users,
			total
		})

	} catch (err) {
		next(err)
	}
}

exports.setLang = async (req, res, next) => {
	try {
		return userService.setLang(req, res, next);
	} catch (err) {
		next(err)
	}
}
