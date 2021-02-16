// models/compatibility.js

const mongoose  = require('mongoose');

const compatibilitySchema = new mongoose.Schema({
    speciesA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'species'
    },
    speciesB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'species'
    },
    compatibility: {
        type: Number,
        default: 0
    },
    warnings:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'warning'
        }
    ]
});

compatibilitySchema.index({ speciesA: 1, speciesB: 1 }, { unique: true })

const compatibility = mongoose.model('compatibility', compatibilitySchema);

module.exports = compatibility;