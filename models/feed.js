// models/feed.js

const mongoose  = require('mongoose');

const feedSchema = new mongoose.Schema({
    name: String,
});

const feed = mongoose.model('feed', feedSchema);

module.exports = feed;