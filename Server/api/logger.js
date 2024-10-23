const pino = require('pino');

// const logger = pino({ prettyPrint: process.env.NODE_ENV === 'development' });
const logger = pino({ prettifier: require('pino-pretty') });

module.exports = logger;
