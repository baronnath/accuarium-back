// mailer/mailer.js

const nodemailer 	= require('nodemailer');
const hbs 			= require('nodemailer-express-handlebars');
const config		= require('../config/mailer');
const {
	handleError,
	ErrorHandler
} 					= require('../helpers/errorHandler');

exports.Email = class Email {

	constructor(language, to, template, data = null, subject = null, from = null){
		
		this.language = language;
    	this.to = to;
    	this.template = template;
    	if(!data)
    		this.data = data;
    	if(!subject)
    		this.subject = 'Accuarium app message';
    	else{
    		this.subject = subject;
    	}
    	if(!from)
    		this.from = config.user;
    	else{
    		this.from = from;
    	}
 	}


 	initTransporter(language) {
		let transporter = nodemailer.createTransport({
			host: config.smtp.host,
			port: config.smtp.port,
			secure: config.smtp.tls,
			// service: 'gmail',
			auth: {
				user: config.user,
				pass: process.env.mailer_password
			}
		});

		let options = {
			viewEngine : {
			    extname: '.hbs', // handlebars extension
			    layoutsDir: './mailer/emails/' + language, // location of handlebars templates
			    defaultLayout: 'main', // name of main template
			    partialsDir: './mailer/emails/' + language + '/partials', // location of your subtemplates aka. header, footer etc
			},
			viewPath: './mailer/emails/' + language,
			extName: '.hbs'
		};
		
		transporter.use('compile', hbs(options));

		return transporter;

 	}


	/*
	send() {
 		const transporter = this.initTransporter();

 		transporter.sendMail({
		    from: this.from,
		    to: this.to,
		    subject: this.subject,
		    template: this.template,
		    context: data,
		}, (err) => {
		    if(err){
		    	helper.logger.error(err);
	        	throw new Error('Email could not be sent to guest - ' + err);
		    }
		});
 	}
 	*/

 	async send() {
 		const transporter = this.initTransporter(this.language);

 		try{
	 		return await transporter.sendMail({
				    from: this.from,
				    to: this.to,
				    subject: this.subject,
				    template: this.template,
				    context: data,
			});
	 	} catch(err) {
	        throw new ErrorHandler(500, 'mailer.error.notSent', err);
	 	}
 	}
}