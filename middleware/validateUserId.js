const mongoose = require('mongoose');
const { User } = require('../models/user');

module.exports = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(404).send('The user ID provided is invalid');
    } else {
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(404).send('The user with the given ID could not be found!');
    } 
    next();
}
