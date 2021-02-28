// src/helpers/multer.js
const multer = require('multer');
const path = require('path');
const moment = require('moment');

module.exports = (destination) => {

	const storage = multer.diskStorage({
	    destination: (req, file, cb) => {
	        cb(null, destination );
	    },
	    filename: (req, file, cb) => {
	        // cb(null, file.originalname  + path.extname(file.originalname));
	        cb(null, moment().format('DDMMYYYYHHmmss') + path.extname(file.originalname));
	    }
	});

	const fileFilter = (req, file, cb) => {
	    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
	        cb(null, true);
	    } else {
	        cb(null, false);
	    }
	}

	return multer({
		storage: storage,
		// fileFilter: fileFilter,
		limits: { fieldSize: 25 * 1024 * 1024 },
	});
}


