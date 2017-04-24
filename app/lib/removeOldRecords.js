const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;
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
    const outputDir = data.request.OUTPUT_DIR;
    const fileType = data.request.type;
    const timerMsg = `Removing old records for ${fileType} took`;
    try {
      log.time(timerMsg);
      const reader =
        fs.createReadStream(`${outputDir}/${fileUtils.getReducedFileName(fileType)}`);
      const currentRecordsWriter =
        fs.createWriteStream(`${outputDir}/${fileUtils.getCurrentRecordsFileName(fileType)}`);

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
