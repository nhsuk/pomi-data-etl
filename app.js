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

function downloadAndProcessBookingSystem() {
  const timerMsg = 'Downloading and transforming Booking System data took';
  return startTimer('Starting download and transformation of Booking System data', timerMsg)
    .then(downloadFile.booking)
    .then(removeColumns.booking)
    .then(getLatestPeriod)
    .then(removeOldRecords.booking)
    .then(convertToJson.booking)
    .then(() => log.timeEnd(timerMsg))
    .catch(handleError);
}

function downloadAndProcessRepeatScripts() {
  const timerMsg = 'Download and transforming Online Repeat Prescriptions data took';
  return startTimer('Starting download and transform of Repeat Prescription data', timerMsg)
    .then(downloadFile.scripts)
    .then(removeColumns.scripts)
    .then(getLatestPeriod)
    .then(removeOldRecords.scripts)
    .then(convertToJson.scripts)
    .then(() => log.timeEnd(timerMsg))
    .catch(handleError);
}

module.exports = {
  downloadAndProcessBookingSystem,
  downloadAndProcessRepeatScripts,
};
