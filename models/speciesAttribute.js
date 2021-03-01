// models/speciesAttribute.js

const mongoose  = require('mongoose');

const speciesAttributeSchema = new mongoose.Schema({
    species: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'species'
    },
    attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attribute'
    },
    value: {
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

const speciesAttribute = mongoose.model('speciesAttribute', speciesAttributeSchema);

module.exports = speciesAttribute;