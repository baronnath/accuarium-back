// models/type.js

const mongoose  = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: String,
    icon: String,
});

const type = mongoose.model('type', typeSchema);

module.exports = type;