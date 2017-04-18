const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const REDUCED_FILE = constants.POMI.REDUCED_FILE;
const POMI_CSV_FILE = constants.POMI.CSV_FILE;

const periods = new Set();
let transformedCount = -1; // -1 to account for header record

function transformData() {
  return transform((data) => {
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
}

function removeColumns() {
  return new Promise((resolve, reject) => {
    try {
      log.time('Removing redundant columns took');
      const pomiDataReader = fs.createReadStream(`${OUTPUT_DIR}/${POMI_CSV_FILE}`);
      const reducedPomiDataWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${REDUCED_FILE}`);

      pomiDataReader
        .pipe(parse())
        .pipe(transformData())
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

