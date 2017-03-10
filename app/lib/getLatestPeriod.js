const log = require('./logger');
const utils = require('./utils');

function getLatestPeriod(periods) {
  log.time('Getting latest period took');
  const latestPeriod = utils.getMostRecentPeriod(periods);
  log.timeEnd('Getting latest period took');
  log.info(`Latest period is ${latestPeriod}`);

  return latestPeriod;
}

module.exports = getLatestPeriod;
