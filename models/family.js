// models/family.js

const mongoose  = require('mongoose');

const familySchema = new mongoose.Schema({
    name: String,
});

const family = mongoose.model('family', familySchema);

module.exports = family;