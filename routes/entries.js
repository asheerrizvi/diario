const express = require('express');
const mongoose = require('mongoose');
const { Entry, validateEntry } = require('../models/entry');
const { User } = require('../models/user');
const router = express.Router();
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const validateUserId = require('../middleware/validateUserId');

// Get all entries of a particular user.
router.get('/', validateUserId, async (req, res) => {
    const user = await User.findById(req.body.userId);
    res.send(user.entries);
});

// Get a particular entry by its unique ID.
router.get('/:id', [validateObjectId, validateUserId] , async (req, res) => {
    const user = await User.findById(req.body.userId);

    const entry = user.entries.find((element) => {
        return element._id.equals(req.params.id);
    });
    if (!entry) return res.status(404).send('The entry with the given ID could not be found!');
    
    res.send(entry);
})

// Push an entry for a particular user.
router.post('/', [validateUserId, validate(validateEntry)], async (req, res) => {
    const user = await User.findById(req.body.userId);

    let entry = new Entry({
        title: req.body.title,
        content: req.body.content
    });

    user.entries.push(entry);
    await user.save();

    res.send(user);
});

// Update an existing entry by its ID.
router.put('/:id', [validateObjectId, validateUserId, validate(validateEntry)], async (req, res) => {
    const user = await User.findById(req.body.userId);

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