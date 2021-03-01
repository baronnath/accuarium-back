// models/feed.js

const mongoose  = require('mongoose');

const feedSchema = new mongoose.Schema({
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
});

const feed = mongoose.model('feed', feedSchema);

module.exports = feed;