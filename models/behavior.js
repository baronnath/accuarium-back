// models/behavior.js

const mongoose  = require('mongoose');

const behaviorSchema = new mongoose.Schema({
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
    warning: {
        type: Boolean,
        default: false
    }, 
});

const behavior = mongoose.model('behavior', behaviorSchema);

module.exports = behavior;