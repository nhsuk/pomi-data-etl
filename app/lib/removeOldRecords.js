const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const PERIOD_END_HEADER = constants.HEADERS.PERIOD_END;

let currentRecordCount = 0;
let oldRecordCount = 0;

function transformData(latestPeriod) {
  return transform((data) => {
    const period = data[0];
    if (period === latestPeriod) {
      currentRecordCount += 1;
      return data;
    } else if (period === PERIOD_END_HEADER) {
      return data;
    }
    oldRecordCount += 1;
    return null;
  });
}

function removeOldRecords(data) {
  return new Promise((resolve, reject) => {
    const fileType = data.request.type;
    const timerMsg = `Removing old records for ${fileType} took`;
    try {
      log.time(timerMsg);
      const reader =
        fs.createReadStream(`${OUTPUT_DIR}/${fileUtils.getReducedFileName(fileType)}`);
      const currentRecordsWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${fileUtils.getCurrentRecordsFileName(fileType)}`);

      reader
        .pipe(parse())
        .pipe(transformData(data.latestPeriod))
        .pipe(stringify())
        .pipe(currentRecordsWriter);

      currentRecordsWriter.on('finish', () => {
        log.timeEnd(timerMsg);
        log.info(`Current record count: ${currentRecordCount}`);
        log.info(`Old record count: ${oldRecordCount}`);
        resolve({ request: data.request });
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = removeOldRecords;
