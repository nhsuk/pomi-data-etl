const log = require('./app/lib/logger');
const downloadFile = require('./app/lib/downloadFile');
const removeColumns = require('./app/lib/removeColumns');
const getLatestPeriod = require('./app/lib/getLatestPeriod');
const removeOldRecords = require('./app/lib/removeOldRecords');
const convertToJson = require('./app/lib/convertToJson');

function handleError(err) {
  log.error('Processing failed', err);
}

function startTimer(msg, timerMsg) {
  return new Promise((resolve, reject) => {
    try {
      log.info(msg);
      log.time(timerMsg);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function downloadAndProcessPomi() {
  const timerMsg = 'Downloading and transforming POMI data took';
  return startTimer('Starting download and transformation of POMI data', timerMsg)
    .then(downloadFile.pomi)
    .then(removeColumns)
    .then(getLatestPeriod)
    .then(removeOldRecords)
    .then(convertToJson)
    .then(() => log.timeEnd(timerMsg))
    .catch(handleError);
}

function app() {
  return downloadAndProcessPomi()
    .catch(handleError);
}

module.exports = app;
