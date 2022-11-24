// models/tank.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const tankSchema = new mongoose.Schema({
    name: {
      type: String,
      default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        autopopulate: true
    },
    species: [
      {
        species: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "species",
            autopopulate: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        main: {
            type: Boolean,
            default: false
        },
        _id: false,
      }
    ],
    // mainSpecies: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "species",
    // },
    // quantity: {
    //     type: Map,
    //     of: Number
    // },
    measures: {
        height: {
            type: Number,
            default: null
        },
        width: {
            type: Number,
            default: null
        },
        length: {
            type: Number,
            default: null
        },
    },
    liters: {
        type: Number,
        default: null
    },
},
{ 
    timestamps: true
});

tankSchema.plugin(mongooseAutopopulate);

const tank = mongoose.model('tank', tankSchema);

module.exports = tank;