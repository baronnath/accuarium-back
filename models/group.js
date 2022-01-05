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
    icon: {
      type: String,
      default: null
    }
});

const group = mongoose.model('group', groupSchema);

module.exports = group;