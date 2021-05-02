// src/helpers/urlGenerator.js

const url = require('url');
const env 				= process.env.NODE_ENV || 'development';
const config 			= require(__dirname + '../../config/server')[env];


exports.getImagesUrl = (relativePath = null) =>  {
	return url.pathToFileURL(this.getImagesPath(relativePath));
}

exports.getImagesPath = (relativePath = null) =>  {
	return __dirname + '/../' + config.imagesFolder + addFinalSlash(relativePath);
}

exports.getUploadsUrl = (relativePath = null) =>  {
	return url.pathToFileURL(this.getUploadsPath(relativePath));
}

exports.getUploadsPath = (relativePath = null) =>  {
	return __dirname + '/../' + config.uploadsFolder + addFinalSlash(relativePath);
}

addFinalSlash = (path) => {
	return path + '/';
} 