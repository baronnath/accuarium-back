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
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'type',
        default: '60416e13bf576133e50d8dab'
    }
});

const family = mongoose.model('family', familySchema);

module.exports = family;