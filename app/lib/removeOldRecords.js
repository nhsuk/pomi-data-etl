const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const PERIOD_END_HEADER = constants.POMI.HEADERS.PERIOD_END;

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

function removeOldRecords(latestPeriod, fileName) {
  return new Promise((resolve, reject) => {
    const timerMsg = `Removing old records for ${fileName} took`;
    try {
      log.time(timerMsg);
      const reducedPomiDataReader =
        fs.createReadStream(`${OUTPUT_DIR}/${fileUtils.getReducedFileName(fileName)}`);
      const currentRecordsWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${fileUtils.getCurrentRecordsFileName(fileName)}`);

      reducedPomiDataReader
        .pipe(parse())
        .pipe(transformData(latestPeriod))
        .pipe(stringify())
        .pipe(currentRecordsWriter);

      currentRecordsWriter.on('finish', () => {
        log.timeEnd(timerMsg);
        log.info(`Current record count: ${currentRecordCount}`);
        log.info(`Old record count: ${oldRecordCount}`);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

function pomi(latestPeriod) {
  return removeOldRecords(latestPeriod, 'POMI');
}

function scripts(latestPeriod) {
  return removeOldRecords(latestPeriod, 'SCRIPTS');
}

module.exports = {
  pomi,
  scripts,
};
