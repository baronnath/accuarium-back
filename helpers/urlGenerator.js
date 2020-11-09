// src/helpers/urlGenerator.js

const env 				= process.env.NODE_ENV || 'development';
const config 			= require(__dirname + '../../config/server')[env];

exports.getImagesUrl = () =>  {
	return __dirname + '/../' + config.imagesFolder;
}