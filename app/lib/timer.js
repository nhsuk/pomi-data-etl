const log = require('./logger');

function start(request, timerMsg) {
  return new Promise((resolve, reject) => {
    try {
      log.info({ request }, 'Starting download and transformation');
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
  end,
  start,
};
