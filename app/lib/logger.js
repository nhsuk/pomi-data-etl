const logger = require('nhsuk-bunyan-logger')('pomi-data-etl');

function time(message) {
  // eslint-disable-next-line no-console
  console.time(message);
}

function timeEnd(message) {
  // eslint-disable-next-line no-console
  console.timeEnd(message);
}

module.exports = {
  info: logger.info.bind(logger),
  error: logger.error.bind(logger),
  time,
  timeEnd,
};
