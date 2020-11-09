// models/behavior.js

const mongoose  = require('mongoose');

const behaviorSchema = new mongoose.Schema({
    name: String,
});

const behavior = mongoose.model('behavior', behaviorSchema);

module.exports = behavior;