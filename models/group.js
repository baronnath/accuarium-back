// models/group.js

const mongoose  = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
});

const group = mongoose.model('group', groupSchema);

module.exports = group;