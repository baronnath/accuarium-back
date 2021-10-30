// services/userService.js

const User 				= require('../models/user');
const Role 				= require('../models/role');
const bcrypt  			= require('bcrypt');
const jwt 				= require('jsonwebtoken');
const jwtSecret			= process.env.JWT_SECRET || 'th1s1sm7s3cr3tj4s0nw3bt0k3n';
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const {	logger } 		= require('../helpers/logger');
const mailer 			= require('../mailer/mailer');
const config			= require('../config/preferences'); 

let user;

// LOGIN CHECK
// Verify the JWT is correct and and not expired
// Store the user and his role in the req to make it available elsewhere
exports.isLoggedIn = async (req) => {
	let user;
	let exp;

	if(!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1){
	   	throw new ErrorHandler(401, 'user.login.notLoggedIn');
  	}

  	try{
 		const auth = await jwt.verify(req.headers.authorization.split(' ')[1], jwtSecret);
 		user = auth.user;
 		exp = auth.exp;
  	} catch {
  		throw new ErrorHandler(401, 'validation.token.notExists');
  	}


  	// Check if token has expired
  	if (exp < Date.now().valueOf() / 1000) { 
	   throw new ErrorHandler(401, 'user.login.sessionExpired');
  	}

	const userObj = await User.findById(user._id);

	if(!userObj){
		throw new ErrorHandler(401, 'validation.token.notExists');
	}

	// Store the user in the request
	return userObj;
}

exports.create = async (req, res, next) => {
	const { email, name, password } = req.body;
	let { role } = req.body;
	const confToken = await this.confirmationToken();
    const hashedPassword = await hashPassword(password);

	user = await User.findOne({email: email});
	if(user)
		throw new ErrorHandler(400, 'This email is already registered');

	// // Access control assigned permissions
	// if(role != 'player'){
	// 	let perm = ac.can(req.user.role.name.en).createAny('user');

	// 	// Check if user has permission to modify the role
	// 	if(perm.attributes.includes('!role'))
	// 		throw new ErrorHandler(403, 'You don\'t have enough permission to an user with this type role');
	// }

	if(!req.role)
		role = 'user';

	role = await Role.findOne({'name.en':role});
	if(!role)
		throw new ErrorHandler(400, 'The role doesn\'t exist');

	user = new User({
		email: email,
		name: name,
		password: hashedPassword,
		confirmationToken: confToken,
		role: role._id
	});

	return await user.save();
}

exports.get = async (req, res, next) => {
	const { userId, email } = req.body

	if(userId){
		user = await User
			.findById(userId);
	}
	else if(email){
		user = await User
			.findOne({email: email});
	}

	if(!user)
		throw new ErrorHandler(400, 'validation.user.notExists');

	return user;
}

exports.update = async (req, res, next) => {
	const { userId, email, password, name} = req.body;
	let { role } = req.body;

	// Check if the user is trying to update his own user or anyone else
	if((userId && userId != req.user._id) || (email && email != req.user.email)){
		console.log(req.user.role);
		let perm = ac.can(req.user.role.name.en).updateAny('user');

		// Check if user has permission to modify the role
		if(!perm.granted)
			throw new ErrorHandler(403, '');
	}

	if(userId){
		user = await User
			.findById(userId);
	}
	else if(email){
		user = await User
			.findOne({email: email});
	}

	if(!user)
		throw new ErrorHandler(400, 'validation.user.notExists');

	// Access control assigned permissions
	if(role){
		let perm = ac.can(req.user.role.name.en).updateOwn('user');

		// Check if user has permission to modify the role
		if(perm.attributes.includes('!role'))
			throw new ErrorHandler(403, 'role.permission.denied');

		role = await Role
			.findOne({name:role});

		user.role = role;
	}

	user.name = name;

	if(password){
		user.password = await hashPassword(password);
	}

	return await user.save();
}

exports.delete = async (req) => {
	const { userId, email } = req.body

	// Check if the user is trying to delete his own user or anyone else
	if((userId && userId != req.user._id) || (email && email != req.user.email)){
		let perm = ac.can(req.user.role.name.en).deleteAny('user');

		// Check if user has permission to modify the role
		if(!perm.granted)
			throw new ErrorHandler(403, 'user.permission.notAny');
	}

	if(userId){
		deletedUser = await User
			.findOneAndDelete({ _id:userId});
	}
	else if(email){
		deletedUser = await User
			.findOneAndDelete({email: email});
	}

    if (!deletedUser) {
    	throw new ErrorHandler(500, 'user.delete.error');
    }

	return deletedUser;
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body;


	user = await User.findOne({email:email}).populate('role');

	if(!user)
		throw new ErrorHandler(406, 'user.get.notExists');

	if(user.confirmationToken === null){ // Account must be verified if confirmationToken is not null

		if(await validatePassword(password, user.password)){

			const accessToken = await this.createAccessToken(user);
			
			user.accessToken = accessToken;
			return await user.save();
			 
		}else

			throw new ErrorHandler(406, 'validation.password.error');
	}
	else{
		throw new ErrorHandler(406, 'user.login.notConfirmed');
	}

}

exports.logout = async (req) => {
	// const { userId, email } = req.body

	// if(userId){
	// 	user = await User
	// 		.findByPk(userId);
	// }
	// else if(email){
	// 	user = await User
	// 		.findOne({ where: {email: email} });
	// }

	// if(!user)
	// 	throw new Error('User does not exist');

	user = await User
			.findById(req.user._id);

	user.accessToken = null;

	await user.save();

	return true;
}

exports.verify = async (req) =>{
	const { email, confirmationToken } = req.body;
	
	user = await User.where({email: email}).findOne()
		.catch( err => {
			return handleError(err)
		});

	if(!user)
		throw new ErrorHandler(406, 'validation.user.notExists');

	if(user.confirmationToken === null)
		throw new ErrorHandler(406, 'user.login.alreadyConfirmed');

	else if(user.confirmationToken != confirmationToken)
		throw new ErrorHnadler(406, 'vaildation.confirmationToken.error');
    
	const accessToken = jwt.sign({ userId: user._id }, jwtSecret, {
			expiresIn: '7d'
		});

	user.accessToken = accessToken;
	user.confirmationToken = null;

	return await user.save();
}

exports.resend = async (req) =>{
	const { email } = req.query;

	user = await User.where({email: email}).findOne()
		.catch( err => {
			return handleError(err)
		});

	if(!user)
		throw new ErrorHandler(406, 'validation.user.notExists');

	if(user.confirmationToken === null)
		throw new ErrorHandler(406, 'user.login.alreadyConfirmed');

	return user;
}

exports.getAccessToken = async (userId, email) => {
	if(userId){
		user = await User
			.findByPk(userId);
	}
	else if(email){
		user = await User
			.findOne({ where: {email: email} });
	}else{
		return null;
	}

	return user.accessToken;
}



exports.confirmationToken = async () => {
	return Math.random().toString(36).slice(-8).toUpperCase();
}

exports.createAccessToken = async (user) => {

	return jwt.sign({
			user: {
				_id: user._id,
				email: user.email,
				name: user.name,
				role: {
					id: user.role._id,
					name: user.role.name
				}
			}
		},
		jwtSecret, {
			expiresIn: '30d'
		}
	);
}

exports.sendInvitation = async (user, req, res, next) => {

	const env = process.env.NODE_ENV || 'development';
	const serverConfig	= require(__dirname + '../../config/server')[env];

	data = {
		url: serverConfig.front.url,
		title: req.i18n.t('user.invitation.title'),
		email: encodeURI(user.email),
		confirmationToken: encodeURI(user.confirmationToken),
		preheader: req.i18n.t('user.invitation.preheader')
	}

	console.log(user.locale);

	let email = new mailer.Email(
		user.locale || 'en',
		user.email,
		'registration-confirmation',
		data,
		req.i18n.t('user.invitation.subject', {user})
	);

	try{
		await email.send();
	} catch (err) {
		next(err)
	}
}

exports.search = async (req, res, next) => {

	const keyword = req.query.keyword;
	let field = req.query.sort;
	let direction = req.query.direction;
	let page = req.query.page;
	const perPage = config.pagination;
	let criteria = {};

	if(!field){
		field = 'name';
	}
	if(!direction){
		direction = 'ascending';
	}

	if(!page){
		page = 0;
	}

	if(keyword){
		const regex = new RegExp(keyword, 'i');
		criteria = {
			$or: [ {name : { $regex: regex }}, { email: { $regex: regex } } ]
		}
	}

	users = await User
		.find(criteria)
		.sort({[field]: direction})
		.skip(perPage * page)
    	.limit(perPage);

   	total = await User
		.find(criteria)
		.countDocuments();

		console.log(users);

	return {
		users,
		total
	}
}

async function validateToken (userId, accessToken) {
	user = await User
		.findByPk(userId);

	if(user.accessToken == accessToken){
		return user
	}else{
		return false
	}
}

async function hashPassword (password) {
	return await bcrypt.hash(password, 10);
}
 
async function validatePassword (plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword);
}



