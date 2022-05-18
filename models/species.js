// models/species.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');
const fs = require('fs');
const urlGenerator = require('../helpers/urlGenerator');

const parameter = {
    min: {
        type: Number,
        default: null
    },
    max: {
        type: Number,
        default: null
    }
};

const speciesSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        trim: true,
    },
    name: {
        en: {
            type: String,
            trim: true,
            default: null
        },
        es: {
            type: String,
            trim: true,
            default: null
        },
    },
    scientificNameSynonyms: [
        {
            type: String,
            trim: true,
            default: null
        }
    ],
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
        temperature: parameter,
        ph: parameter,
        gh: parameter,
        kh: parameter,
        tds: parameter
    },
    coexistence: {
        indiv: {
            type: Boolean,
        },
        couple: {
            type: Boolean,
        },
        onlyMasc: {
            type: Boolean,
        },
        onlyFem: {
            type: Boolean,
        },
        harem: {
            type: Boolean,
        },
        inverseHarem: {
            type: Boolean,
        },
        mixedGroup: {
            type: Boolean,
        }
    },
    minGroupNumber: {
        type: Number,
        default: null
    },
    volumeSpecimen: {
        type: Number
    },
    minTankVolume: {
        type: Number
    },
    length: parameter,
    salt: { // 0: Freshwater, 1: Salt, 2: Brackish
        type: Number,
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
    timestamps: true,
    minimize: false,
    toJSON: {
      virtuals: true 
    },
});

// Create virtual property to store images
speciesSchema.virtual('images')
  .get(function() { return this._images; })
  .set(function(value) { this._images = value; });

// Retrieve all images with species scientific name
speciesSchema.post(['find', 'findOne'], function(docs) {
  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  
  for (const species of docs) {
    const path = urlGenerator.getImagesPath('species') + '/' + species.scientificName.replace(' ', '-');
    const exists = fs.existsSync(path);
    if(exists){
      images = fs.readdirSync(path);
      species.images = images;
    }
  }
});

speciesSchema.plugin(mongooseAutopopulate);

const species = mongoose.model('species', speciesSchema);

module.exports = species;