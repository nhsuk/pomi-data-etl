const log = require('./app/lib/logger');
const downloadFile = require('./app/lib/downloadFile');
const removeColumns = require('./app/lib/removeColumns');
const getLatestPeriod = require('./app/lib/getLatestPeriod');
const removeOldRecords = require('./app/lib/removeOldRecords');

function handleError(err) {
  log.error('Processing failed', err);
}

function app() {
  return Promise
    .all([
      log.info('Starting download and transformation of POMI data'),
      log.time('Downloading and transforming POMI data took')])
    .then(downloadFile)
    .then(removeColumns)
    .then(getLatestPeriod)
    .then(removeOldRecords)
    .then(() => log.timeEnd('Downloading and transforming POMI data took'))
    .catch(handleError);
}

module.exports = app;
