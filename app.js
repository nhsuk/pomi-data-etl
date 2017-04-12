const log = require('./app/lib/logger');
const downloadFile = require('./app/lib/downloadFile');
const removeColumns = require('./app/lib/removeColumns');
const getLatestPeriod = require('./app/lib/getLatestPeriod');
const removeOldRecords = require('./app/lib/removeOldRecords');
const convertToJson = require('./app/lib/convertToJson');

function handleError(err) {
  log.error('Processing failed', err);
}

function startTimer() {
  return new Promise((resolve, reject) => {
    try {
      log.info('Starting download and transformation of POMI data');
      log.time('Downloading and transforming POMI data took');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function app() {
  return startTimer()
    .then(downloadFile)
    .then(removeColumns)
    .then(getLatestPeriod)
    .then(removeOldRecords)
    .then(convertToJson)
    .then(() => log.timeEnd('Downloading and transforming POMI data took'))
    .catch(handleError);
}

module.exports = app;
