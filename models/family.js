// models/family.js

const mongoose  = require('mongoose');

const familySchema = new mongoose.Schema({
    name: {
        en: {
        	type: String,
            default: null
        },
        es: {
        	type: String,
            default: null
        },
    }
});

const family = mongoose.model('family', familySchema);

module.exports = family;