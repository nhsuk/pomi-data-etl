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

function removeColumns(request) {
  const fileType = request.type;
  return new Promise((resolve, reject) => {
    const timerMsg = `Removing redundant columns from ${fileType} took`;
    try {
      log.time(timerMsg);
      const reader =
        fs.createReadStream(`${OUTPUT_DIR}/${fileUtils.getSimpleFileName(fileType)}`);
      const writer =
        fs.createWriteStream(`${OUTPUT_DIR}/${fileUtils.getReducedFileName(fileType)}`);

      reader
        .pipe(parse())
        .pipe(transformData())
        .pipe(stringify())
        .pipe(writer);

      writer.on('finish', () => {
        log.timeEnd(timerMsg);
        log.info(`Records processed for ${fileType} data column removal: ${transformedCount}`);
        resolve({ periods, request });
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = removeColumns;
