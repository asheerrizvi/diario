const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Entry, validateEntry } = require('../models/entry');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const validateUserId = require('../middleware/validateUserId');

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user.entries);
});

router.get('/:id', [auth, validateObjectId] , async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    const entry = user.entries.find((element) => {
        return element._id.equals(req.params.id);
    });
    if (!entry) return res.status(404).send('The entry with the given ID could not be found!');
    
    res.send(entry);
})

router.post('/', [auth, validate(validateEntry)], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    let entry = new Entry({
        title: req.body.title,
        content: req.body.content
    });

    user.entries.push(entry);
    await user.save();

    res.send(user);
});

router.put('/:id', [auth, validateObjectId, validate(validateEntry)], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    const entry = user.entries.find((element) => {
        return element._id.equals(req.params.id);
    });
    if (!entry) return res.status(404).send('The entry with the given ID could not be found!');

    entry.title = req.body.title;
    entry.content = req.body.content;

    await user.save();

    res.send(entry);
});

module.exports = router;