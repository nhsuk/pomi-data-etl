const log = require('./app/lib/logger');
const downloadFile = require('./app/lib/downloadFile');
const removeColumns = require('./app/lib/removeColumns');
const getLatestPeriod = require('./app/lib/getLatestPeriod');
const removeOldRecords = require('./app/lib/removeOldRecords');
const convertToJson = require('./app/lib/convertToJson');

function handleError(err) {
  log.error('Processing failed', err);
}

function startTimer(request, timerMsg) {
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

function downloadAndProcessFile(request) {
  const timerMsg = `Download and transforming ${request.type} data took`;
  return startTimer(request, timerMsg)
    .then(downloadFile)
    .then(removeColumns)
    .then(getLatestPeriod)
    .then(removeOldRecords)
    .then(convertToJson)
    .then(() => log.timeEnd(timerMsg))
    .catch(handleError);
}

module.exports = {
  downloadAndProcessFile,
};
