// models/endPoint.js

const mongoose  = require('mongoose');

const endPointSchema = new mongoose.Schema({
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

const endPoint = mongoose.model('endPoint', endPointSchema);

module.exports = endPoint;