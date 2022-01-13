// models/group.js

const mongoose  = require('mongoose');

const groupSchema = new mongoose.Schema({
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
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'type',
      default: '60416e13bf576133e50d8dab'
    },
    icon: {
      type: String,
      default: null
    }
});

const group = mongoose.model('group', groupSchema);

module.exports = group;