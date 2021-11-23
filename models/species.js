// models/species.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const speciesSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        trim: true,
        default: null
    },
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
    otherNames: {
        en: [
            {
                type: String,
                trim: true,
            }
        ],
        es: [
            {
                type: String,
                trim: true,
            }
        ],
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
        gh: {
            min: {
                type: Number,
                default: null
            },
            max: {
                type: Number,
                default: null
            } 
        },
        kh: {
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
    minTankLiters: {
        type: Number
    },
    specimenNumber: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        } 
    },
    length: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        } 
    },
    salt: {
        type: Boolean,
        default: false
    },
    cleaning: {
        type: Boolean,
        default: false
    },
    wild: {
        type: Boolean,
        default: false
    },
    feed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feed',
        autopopulate: true
    },
    varietyOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'species',
        autopopulate: true,
        default: null,
    },
    depth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depth',
        autopopulate: true
    },
    behavior: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'behavior',
            autopopulate: true
        }
    ],
    color: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'color',
            autopopulate: true
        }
    ]
},
{ 
    timestamps: true
});

speciesSchema.plugin(mongooseAutopopulate);

const species = mongoose.model('species', speciesSchema);

module.exports = species;