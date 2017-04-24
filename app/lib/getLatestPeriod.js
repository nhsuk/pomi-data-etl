const log = require('./logger');
const utils = require('./utils');

function getLatestPeriod(data) {
  log.time('Getting latest period took');
  const latestPeriod = utils.getMostRecentPeriod(data.periods);
  log.timeEnd('Getting latest period took');
  log.info(`Latest period is ${latestPeriod}`);

  return { latestPeriod, request: data.request };
}

module.exports = getLatestPeriod;
