// models/species.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');
const fs = require('fs');

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

// Retrieve all images within the folder named as the species scientific name, no matter file name or extension
speciesSchema.post(['find', 'findOne'], function(docs) {
  const { addSpeciesImages } = require('../services/speciesService');

  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  
  for (let species of docs) {
    species = addSpeciesImages(species);
  }
});

speciesSchema.plugin(mongooseAutopopulate);

speciesSchema.index(
  {
    scientificName: 'text',
    'name.en': 'text',
    'name.es': 'text',
    scientificNameSynonyms: 'text',
    'otherNames.en': 'text',
    'otherNames.es': 'text',
  }
 )

const species = mongoose.model('species', speciesSchema);

module.exports = species;