const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const REDUCED_POMI_FILE = constants.REDUCED_POMI_FILE;
const CURRENT_RECORDS_FILE = constants.CURRENT_RECORDS_FILE;
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

function removeOldRecords(latestPeriod) {
  return new Promise((resolve, reject) => {
    try {
      log.time('Removing old records took');
      const reducedPomiDataReader =
        fs.createReadStream(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`);
      const currentRecordsWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);

      reducedPomiDataReader
        .pipe(parse())
        .pipe(transformData(latestPeriod))
        .pipe(stringify())
        .pipe(currentRecordsWriter);

      currentRecordsWriter.on('finish', () => {
        log.timeEnd('Removing old records took');
        log.info(`Current record count: ${currentRecordCount}`);
        log.info(`Old record count: ${oldRecordCount}`);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = removeOldRecords;
