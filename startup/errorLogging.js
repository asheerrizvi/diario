require('express-async-errors');
const { log } = require('./log');

module.exports = function () {
    process.on('uncaughtException', (exception) => {
        log.fatal(exception, exception.message);
        process.exit(1);
    });

    process.on('unhandledRejection', (exception) => {
        log.fatal(exception, exception.message);
        process.exit(1);
    });
}