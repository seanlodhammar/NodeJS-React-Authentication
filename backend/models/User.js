const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    providers: {
        type: Array,
        required: false,
    },
    userId: {
        type: Object,
        required: false,
    },
    _id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    profilePictures: {
        type: Object,
        required: false
    }
}, { versionKey: false, _id: false });

module.exports = mongoose.model('User', User);