// models/role.js

const mongoose  = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: String
});

const role = mongoose.model('role', roleSchema);

module.exports = role;