const { log } = require('../startup/log');

module.exports = (err, req, res, next) => {
    log.error(err, err.message);
    res.status(500).send('Something failed...');
}