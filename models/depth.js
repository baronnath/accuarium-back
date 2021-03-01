// models/depth.js

const mongoose  = require('mongoose');

const depthSchema = new mongoose.Schema({
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

const depth = mongoose.model('depth', depthSchema);

module.exports = depth;