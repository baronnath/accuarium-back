// models/color.js

const mongoose  = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        en: {
        	type: String,
            default: null
        },
        es: {
        	type: String,
            default: null
        }
    }
});

const color = mongoose.model('color', colorSchema);

module.exports = color;