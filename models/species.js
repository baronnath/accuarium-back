// models/species.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const speciesSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    otherNames: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: 'https://dummyimage.com/225x225/aaaaaa/ffffff.jpg&text=Diologist',
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'type',
        autopopulate: true
    },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'family',
        autopopulate: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        autopopulate: true
    },
    parameters: {
        temperature: {
            min: {
                type: Number,
                default: null
            },
            max: {
                type: Number,
                default: null
            }
        },
        ph: {
            min: {
                type: Number,
                default: null
            },
            max: {
                type: Number,
                default: null
            }  
        },
        dh: {
            min: {
                type: Number,
                default: null
            },
            max: {
                type: Number,
                default: null
            } 
        }
    },
    litersSpecimen: {
        type: Number
    },
    lenght: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        } 
    },
    feed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feed',
        autopopulate: true
    },
    varietyOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'species',
        autopopulate: true
    },
    depth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depth',
        autopopulate: true
    },
    behavior: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'behavior',
        autopopulate: true
    }
},
{ 
    timestamps: true
});

speciesSchema.plugin(mongooseAutopopulate);

const species = mongoose.model('species', speciesSchema);

module.exports = species;