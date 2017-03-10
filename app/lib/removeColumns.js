const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const REDUCED_POMI_FILE = constants.REDUCED_POMI_FILE;
const POMI_FILE = constants.POMI_FILE;

const periods = new Set();
let transformedCount = -1; // -1 to account for header record

const transformData = transform((data) => {
  const periodEnd = data[1];
  const gpPracticeCode = data[9];
  const supplier = data[11];
  const trimmedData = [
    periodEnd,
    gpPracticeCode,
    supplier];

  periods.add(periodEnd);
  transformedCount += 1;
  return trimmedData;
});

function removeColumns() {
  return new Promise((resolve, reject) => {
    try {
      log.time('Removing redundant columns took');
      const pomiDataReader = fs.createReadStream(`${OUTPUT_DIR}/${POMI_FILE}`);
      const reducedPomiDataWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`);

      pomiDataReader
        .pipe(parse())
        .pipe(transformData)
        .pipe(stringify())
        .pipe(reducedPomiDataWriter);

      reducedPomiDataWriter.on('finish', () => {
        log.timeEnd('Removing redundant columns took');
        log.info(`Records processed for column removal: ${transformedCount}`);
        resolve(periods);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = removeColumns;

