const express = require('express');
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
const router = express.Router();
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID could not be found!');

    res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('A user with this email already exists.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    await user.save();
    res.send(user);
});

module.exports = router;