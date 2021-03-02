// models/user.js

const mongoose  = require('mongoose');
const mongooseAutopopulate = require('mongoose-autopopulate');

const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        unique: true
    },
    name: {
        type: String,
        default: null
    },
    confirmationToken: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: 'https://dummyimage.com/225x225/aaaaaa/ffffff.jpg&text=Diologist',
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        autopopulate: true
    },
    notification: {
        type: Boolean,
        default: true
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

userSchema.plugin(mongooseAutopopulate);

userSchema.pre('save', function(next) {

    next();
});

// Remove credentials and tokens when the entity is sent as JSON
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.confirmationToken;
    delete obj.accessToken;
    return obj;
}

const user = mongoose.model('user', userSchema);

module.exports = user;