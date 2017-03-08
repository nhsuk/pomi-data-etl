const log = require('./logger');
const utils = require('./utils');

function getLatestPeriod(periods) {
  return new Promise((resolve, reject) => {
    try {
      log.time('Getting latest period took');
      const latestPeriod = utils.getMostRecentPeriod(periods);
      log.timeEnd('Getting latest period took');
      log.info(`Latest period is ${latestPeriod}`);

      resolve(latestPeriod);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = getLatestPeriod;

