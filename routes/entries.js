const express = require('express');
const mongoose = require('mongoose');
const { Entry, validateEntry } = require('../models/entry');
const { User } = require('../models/user');
const router = express.Router();
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');

// Get all entries of a particular user.
router.get('/', async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send('The user with the given ID could not be found!');

    res.send(user.entries);
});

// Get a particular entry by its unique ID
router.get('/:id', validateObjectId, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(404).send('The user ID provided is invalid');
    }

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send('The user with the given ID could not be found!');

    const entry = user.entries.find((element) => {
        return element._id.equals(req.params.id);
    });
    if (!entry) return res.status(404).send('The entry with the given ID could not be found!');
    
    res.send(entry);
})

// Push an entry for a particular user.
router.post('/', validate(validateEntry), async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(404).send('The user ID provided is invalid');
    }

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send('The user with the given ID could not be found!');

    let entry = new Entry({
        title: req.body.title,
        content: req.body.content
    });

    user.entries.push(entry);
    await user.save();

    res.send(user);
});

module.exports = router;