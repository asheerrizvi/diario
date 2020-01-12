const express = require('express');
const { Entry } = require('../models/entry');
const { User } = require('../models/user');
const router = express.Router();

// Get all entries of a particular user.
router.get('/', async (req, res) => {
    const user = await User.findById(req.body.userId);
    res.send(user.entries);
});

// Push an entry for a particular user.
router.post('/', async (req, res) => {
    const user = await User.findById(req.body.userId);
    let entry = new Entry({
        title: req.body.title,
        content: req.body.content
    });
    user.entries.push(entry);
    await user.save();
    res.send(user);
});

module.exports = router;