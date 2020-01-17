const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
// const jwt = require('jsonwebtoken');

const entrySchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 150
    },
    content: {
        type: String,
        required: true,
        maxlength: 1500000
    }
});

const Entry = mongoose.model('Entry', entrySchema);

function validateEntry(entry) {
    const schema = {
        userId: Joi.string().required(),
        title: Joi.string().min(3).max(150).required(),
        content: Joi.string().max(1500000).required()
    };
    return Joi.validate(entry, schema);
}

module.exports.entrySchema = entrySchema;
module.exports.Entry = Entry;
module.exports.validateEntry = validateEntry;
