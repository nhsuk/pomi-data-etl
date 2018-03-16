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
  error: logger.error.bind(logger),
  info: logger.info.bind(logger),
  time,
  timeEnd,
};
