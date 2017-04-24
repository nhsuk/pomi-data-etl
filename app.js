const convertToJson = require('./app/lib/convertToJson');
const constants = require('./app/lib/constants');
const getLatestPeriod = require('./app/lib/getLatestPeriod');
const log = require('./app/lib/logger');
const removeColumns = require('./app/lib/removeColumns');
const removeOldRecords = require('./app/lib/removeOldRecords');
const saveFile = require('./app/lib/saveFile');

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

module.exports = {
  downloadAndProcessFile,
};
