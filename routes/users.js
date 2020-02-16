const express = require('express');
const _ = require('lodash');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('A user with this email already exists.');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();
    let responseData = _.pick(user, ['id', 'name', 'email']);
    responseData.token = token;
    res.send(responseData);
});

router.delete('/', auth, async (req, res) => {
    const user = await User.findByIdAndRemove(req.user._id);
    res.status(200).send('Account deleted successfully.');
});

module.exports = router;