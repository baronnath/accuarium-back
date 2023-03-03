// services/leadService.js

const Lead 				= require('../models/lead');
const {	ErrorHandler, handleError } = require('../helpers/errorHandler');
const mailer 			= require('../mailer/mailer');

let lead;

exports.create = async (req, res, next) => {
	const { email, locale } = req.body;

	lead = await Lead.findOne({email: email});
	if(lead)
    throw new ErrorHandler(400, 'validation.email.exists');

	lead = new Lead({
		email: email,
		locale: locale,
	});

	return await lead.save();
}

exports.get = async (req, res, next) => {
	const { leadId, email } = req.body

	if(leadId){
		lead = await Lead
			.findById(leadId);
	}
	else if(email){
		lead = await Lead
			.findOne({email: email});
	}

	if(!lead)
		throw new ErrorHandler(400, 'validation.lead.notExists');

	return lead;
}

exports.getAll = async (req, res, next) => {

	leads = await Lead.find();

	return leads;
}

exports.update = async (req, res, next) => {
	const { leadId, email, locale } = req.body;

	if(leadId){
		lead = await Lead
			.findById(leadId);
	}
	else if(email){
		lead = await Lead
			.findOne({email: email});
	}

	if(!lead)
		throw new ErrorHandler(400, 'validation.lead.notExists');

	lead.locale = locale;

	return await lead.save();
}

exports.delete = async (req) => {
	const { leadId, email } = req.body
  let params;

	if(leadId){
    params = { _id: leadId};
	}
	else if(email){
		params = {email: email};
	}

  deletedLead = await Lead
			.findOneAndDelete(params);

  if (!deletedLead) {
    throw new ErrorHandler(500, 'lead.delete.error');
  }

	return deletedLead;
}

exports.sendConfirmation = async (lead, req, res, next) => {

	const env = process.env.NODE_ENV || 'development';
	const serverConfig	= require(__dirname + '../../config/server')[env];

	data = {
		url: serverConfig.front.url,
		title: req.i18n.t('lead.confirmation.title'),
		email: encodeURI(lead.email),
		preheader: req.i18n.t('lead.confirmation.preheader')
	}

	let email = new mailer.Email(
		lead.locale || 'en',
		lead.email,
		'lead-confirmation',
		data,
		req.i18n.t('lead.confirmation.subject')
	);

	try{
		await email.send();
	} catch (err) {
		next(err)
	}
}



