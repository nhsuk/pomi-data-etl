const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;
const stringify = csv.stringify;

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
  const outputDir = request.OUTPUT_DIR;
  const fileType = request.type;

  return new Promise((resolve, reject) => {
    const timerMsg = `Removing redundant columns from ${fileType} took`;
    try {
      log.time(timerMsg);
      const reader =
        fs.createReadStream(`${outputDir}/${fileUtils.getSimpleFileName(fileType)}`);
      const writer =
        fs.createWriteStream(`${outputDir}/${fileUtils.getReducedFileName(fileType)}`);

      reader
        .pipe(parse())
        .pipe(transformData())
        .pipe(stringify())
        .pipe(writer);

      writer.on('finish', () => {
        log.timeEnd(timerMsg);
        log.info({ fileType, transformedCount }, `Records processed for ${fileType} data column removal: ${transformedCount}`);
        resolve({ periods, request });
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = removeColumns;
