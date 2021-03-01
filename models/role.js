// models/role.js

const mongoose  = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        en: {
        	type: String,
            default: null
        },
        es: {
        	type: String,
            default: null
        },
    }
});

const role = mongoose.model('role', roleSchema);

module.exports = role;