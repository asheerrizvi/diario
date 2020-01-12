const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
// const jwt = require('jsonwebtoken');

const entrySchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 130
    },
    content: {
        type: String,
        required: true,
        maxlength: 1500000
    }
});


const Entry = mongoose.model('Entry', entrySchema);

module.exports.entrySchema = entrySchema;
module.exports.Entry = Entry;