// models/permission.js

const mongoose  = require('mongoose');

const permissionSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    endPoint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'endPoint'
    },
    grants: {
        createOwn: {
            type: Boolean,
            default: false
        },
        readOwn: {
            type: Boolean,
            default: false
        },
        updateOwn: {
            type: Boolean,
            default: false
        },
        deleteOwn: {
          type: Boolean,
          default: false
        },
        createAny: {
          type: Boolean,
          default: false
        },
        readAny: {
          type: Boolean,
          default: false
        },
        updateAny: {
          type: Boolean,
          default: false
        },
        deleteAny: {
          type: Boolean,
          default: false
        },
    },
    excludes:  {
        createOwn: {
            type: String,
            default: null
        },
        readOwn: {
            type: String,
            default: null
        },
        updateOwn: {
            type: String,
            default: null
        },
        deleteOwn: {
            type: String,
            default: null
        },
        createAny: {
            type: String,
            default: null
        },
        readAny: {
            type: String,
            default: null
        },
        updateAny: {
            type: String,
            default: null
        },
        deleteAny: {
            type: String,
            default: null
        }
    }
});

permissionSchema.index({ role: 1, endPoint: 1 }, { unique: true })

const permission = mongoose.model('permission', permissionSchema);

module.exports = permission;