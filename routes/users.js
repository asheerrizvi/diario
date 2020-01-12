const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    await user.save();
    res.send(user);
})

module.exports = router;