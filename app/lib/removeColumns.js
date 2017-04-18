const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

const OUTPUT_DIR = constants.OUTPUT_DIR;

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

function removeColumns(fileName) {
  return new Promise((resolve, reject) => {
    const timerMsg = `Removing redundant columns from ${fileName} took`;
    try {
      log.time(timerMsg);
      const pomiDataReader = fs.createReadStream(`${OUTPUT_DIR}/${fileUtils.getSimpleFileName(fileName)}`);
      const reducedPomiDataWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${fileUtils.getReducedFileName(fileName)}`);

      pomiDataReader
        .pipe(parse())
        .pipe(transformData())
        .pipe(stringify())
        .pipe(reducedPomiDataWriter);

      reducedPomiDataWriter.on('finish', () => {
        log.timeEnd(timerMsg);
        log.info(`Records processed for ${fileName} data column removal: ${transformedCount}`);
        resolve(periods);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function pomi() {
  return removeColumns('POMI');
}

function scripts() {
  return removeColumns('SCRIPTS');
}

module.exports = {
  pomi,
  scripts,
};
