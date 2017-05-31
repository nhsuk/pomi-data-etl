const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'pomi-etl' });

function info(message) {
  log.info(message);
}

function error(message, err) {
  log.error(message, err);
}

function time(message) {
  // eslint-disable-next-line no-console
  console.time(message);
}

function timeEnd(message) {
  // eslint-disable-next-line no-console
  console.timeEnd(message);
}

module.exports = {
  info,
  error,
  time,
  timeEnd,
};
