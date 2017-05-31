const log = require('./logger');

function start(request, timerMsg) {
  return new Promise((resolve, reject) => {
    try {
      log.info(`Starting download and transformation of ${request.type} data`);
      log.time(timerMsg);
      resolve(request);
    } catch (err) {
      reject(err);
    }
  });
}

function end(timerMsg) {
  log.timeEnd(timerMsg);
}

module.exports = {
  start,
  end
};
