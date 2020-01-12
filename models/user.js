const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
// const jwt = require('jsonwebtoken');

const { entrySchema } = require('./entry');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    }, 
    email: { 
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    entries: [{
        type: entrySchema
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// userSchema.methods.generateAuthToken = function() {
//     const token = jwt.sign({
//         _id: this._id,
//         isAdmin: this.isAdmin
//     }, config.get('jwtPrivateKey'));
//     return token;
// }

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).max(1024).required(),
        isAdmin: Joi.boolean()
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
