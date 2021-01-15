// models/tank.js

const mongoose  = require('mongoose');

const tankSchema = new mongoose.Schema({
    name: {
      type: String,
      default: null
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    ],
    species: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "species"
      }
    ],
    quantity: {
        type: Map,
        of: Number
    },
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
});

const tank = mongoose.model('tank', tankSchema);

module.exports = tank;