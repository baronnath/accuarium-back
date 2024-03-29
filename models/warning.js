// models/warning.js

const mongoose  = require('mongoose');

const warningSchema = new mongoose.Schema({
    name: {
    	en: {
        	type: String,
            default: null
        },
        es: {
        	type: String,
            default: null
        },
    },
});

const warning = mongoose.model('warning', warningSchema);

module.exports = warning;