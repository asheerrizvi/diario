const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = express.Router();

const { User } = require('../models/user');
const validate = require('../middleware/validate');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/', validate(validateAuth), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).max(1024).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;