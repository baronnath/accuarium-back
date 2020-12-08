// models/warning.js

const mongoose  = require('mongoose');

const warningSchema = new mongoose.Schema({
    name: String,
});

const warning = mongoose.model('warning', warningSchema);

module.exports = warning;