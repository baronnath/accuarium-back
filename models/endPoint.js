// models/endPoint.js

const mongoose  = require('mongoose');

const endPointSchema = new mongoose.Schema({
    name: String,
});

const endPoint = mongoose.model('endPoint', endPointSchema);

module.exports = endPoint;