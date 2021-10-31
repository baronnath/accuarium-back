// models/locale.js

const mongoose  = require('mongoose');

const localeSchema = new mongoose.Schema({
    lang: {
        type: String,
        default: 'en'
    },
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

const locale = mongoose.model('locale', localeSchema);

module.exports = locale;