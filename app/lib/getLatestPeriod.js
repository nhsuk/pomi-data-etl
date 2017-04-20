const log = require('./logger');
const utils = require('./utils');

function getLatestPeriod(data) {
  return new Promise((resolve, reject) => {
    try {
      log.time('Getting latest period took');
      const latestPeriod = utils.getMostRecentPeriod(data.periods);
      log.timeEnd('Getting latest period took');
      log.info(`Latest period is ${latestPeriod}`);

      resolve({ latestPeriod, request: data.request });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = getLatestPeriod;
