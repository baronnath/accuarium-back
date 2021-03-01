// models/type.js

const mongoose  = require('mongoose');

const typeSchema = new mongoose.Schema({
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
    icon: String,
});

const type = mongoose.model('type', typeSchema);

module.exports = type;