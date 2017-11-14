const convertToJson = require('./convertToJson');
const constants = require('./constants');
const getLatestPeriod = require('./getLatestPeriod');
const log = require('./logger');
const removeColumns = require('./removeColumns');
const removeOldRecords = require('./removeOldRecords');
const saveFile = require('./saveFile');
const timer = require('./timer');

function handleError(err) {
  log.error({ err }, 'Processing failed');
}

function downloadAndProcessFile(request) {
  // eslint-disable-next-line no-param-reassign
  request.OUTPUT_DIR = request.OUTPUT_DIR || constants.OUTPUT_DIR;
  const timerMsg = `Download and transforming ${request.type} data took`;
  return timer.start(request, timerMsg)
    .then(saveFile)
    .then(removeColumns)
    .then(getLatestPeriod)
    .then(removeOldRecords)
    .then(convertToJson)
    .then(() => timer.end(timerMsg))
    .catch(handleError);
}

module.exports = downloadAndProcessFile;
