// models/depth.js

const mongoose  = require('mongoose');

const depthSchema = new mongoose.Schema({
    name: String,
});

const depth = mongoose.model('depth', depthSchema);

module.exports = depth;