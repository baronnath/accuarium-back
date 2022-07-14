// models/lead.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const leadSchema = new mongoose.Schema({
    email: { 
        type: String,
        unique: true
    },
    locale: {
        type: String,
        default: 'en'
    },
    synchronizedAt: {
        type: Date,
        default: Date.now
    },
},
{ 
    timestamps: true
});

const lead = mongoose.model('lead', leadSchema);

module.exports = lead;