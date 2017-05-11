const convertToJson = require('./convertToJson');
const constants = require('./constants');
const getLatestPeriod = require('./getLatestPeriod');
const log = require('./logger');
const removeColumns = require('./removeColumns');
const removeOldRecords = require('./removeOldRecords');
const saveFile = require('./saveFile');

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
  // eslint-disable-next-line no-param-reassign
  request.OUTPUT_DIR = request.OUTPUT_DIR || constants.OUTPUT_DIR;
  const timerMsg = `Download and transforming ${request.type} data took`;
  return startTimer(request, timerMsg)
    .then(saveFile)
    .then(removeColumns)
    .then(getLatestPeriod)
    .then(removeOldRecords)
    .then(convertToJson)
    .then(() => log.timeEnd(timerMsg))
    .catch(handleError);
}

module.exports = downloadAndProcessFile;
