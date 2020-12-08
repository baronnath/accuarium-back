// models/attribute.js

const mongoose  = require('mongoose');

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    }
});

const attribute = mongoose.model('attribute', attributeSchema);

module.exports = attribute;